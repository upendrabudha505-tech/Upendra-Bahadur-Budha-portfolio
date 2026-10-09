import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use local ./data directory when writable, with safe fallback to os.tmpdir()
let activeDataDir = path.join(__dirname, 'data');

function getSafeDataDir() {
  try {
    if (!fs.existsSync(activeDataDir)) {
      fs.mkdirSync(activeDataDir, { recursive: true });
    }
    return activeDataDir;
  } catch {
    activeDataDir = path.join(os.tmpdir(), 'upendra-portfolio-data');
    try {
      if (!fs.existsSync(activeDataDir)) {
        fs.mkdirSync(activeDataDir, { recursive: true });
      }
    } catch {
      // Ignore if tmpdir also fails
    }
    return activeDataDir;
  }
}

function getFilePath(filename: string): string {
  return path.join(getSafeDataDir(), filename);
}

function readJsonFile(filename: string, fallbackValue: any): any {
  try {
    const filePath = getFilePath(filename);
    if (!fs.existsSync(filePath)) {
      return fallbackValue;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

function writeJsonFile(filename: string, data: any): void {
  try {
    const filePath = getFilePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Warning: Could not persist ${filename}:`, err);
  }
}

function saveBase64ImageToAssetFiles(dataUrl: string, relativePaths: string[]) {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) return;
  try {
    const base64Part = dataUrl.split(',')[1];
    if (!base64Part) return;
    const buf = Buffer.from(base64Part, 'base64');
    for (const rel of relativePaths) {
      const fullPath = path.join(__dirname, rel);
      try {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, buf);
      } catch {
        // Ignore if specific target path is read-only
      }
    }
  } catch {
    // Ignore decode error
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '100mb' }));

  // Serve static media folders at both /assets and /public/assets in all modes
  app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
  app.use('/public/assets', express.static(path.join(__dirname, 'public', 'assets')));
  app.use('/src/assets/video', express.static(path.join(__dirname, 'src', 'assets', 'video')));

  // ==========================================================================
  // HEALTH CHECK ENDPOINT
  // ==========================================================================
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ==========================================================================
  // API ROUTES FOR VISITOR MESSAGES INBOX
  // ==========================================================================
  app.get('/api/messages', (_req, res) => {
    const messages = readJsonFile('messages.json', []);
    res.json({ messages: Array.isArray(messages) ? messages : [] });
  });

  app.post('/api/messages', (req, res) => {
    const { fullName, email, subject, message, website } = req.body || {};

    // Honeypot spam protection: if hidden 'website' field is filled by a bot, silently accept
    if (website && String(website).trim() !== '') {
      res.status(200).json({ message: null, messages: readJsonFile('messages.json', []) });
      return;
    }

    if (!fullName || !email || !subject || !message) {
      res
        .status(400)
        .json({ error: 'All fields (fullName, email, subject, message) are required.' });
      return;
    }

    const emailStr = String(email).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fullName: String(fullName).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      submittedAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
    };

    const existing = readJsonFile('messages.json', []);
    const list = Array.isArray(existing) ? existing : [];
    const updated = [newMsg, ...list];
    writeJsonFile('messages.json', updated);
    res.status(201).json({ message: newMsg, messages: updated });
  });

  app.patch('/api/messages/:id/read', (req, res) => {
    const { id } = req.params;
    const existing = readJsonFile('messages.json', []);
    const list = Array.isArray(existing) ? existing : [];
    const updated = list.map((m) => (m && m.id === id ? { ...m, read: true } : m));
    writeJsonFile('messages.json', updated);
    res.json({ messages: updated });
  });

  app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    const existing = readJsonFile('messages.json', []);
    const list = Array.isArray(existing) ? existing : [];
    const updated = list.filter((m) => m && m.id !== id);
    writeJsonFile('messages.json', updated);
    res.json({ messages: updated });
  });

  // ==========================================================================
  // API ROUTES FOR PROFILE & CV PHOTO PERSISTENCE ACROSS ALL DEVICES/PHONES
  // ==========================================================================
  app.get('/api/profile-photo', (_req, res) => {
    const data = readJsonFile('profile_photo.json', { photoDataUrl: null });
    if (data && data.photoDataUrl) {
      res.json({ photoDataUrl: data.photoDataUrl });
      return;
    }
    // Fallback to cv_data.json's profilePhotoDataUrl if present
    const cvData = readJsonFile('cv_data.json', null);
    if (
      cvData &&
      typeof cvData.profilePhotoDataUrl === 'string' &&
      cvData.profilePhotoDataUrl.startsWith('data:image/')
    ) {
      res.json({ photoDataUrl: cvData.profilePhotoDataUrl });
      return;
    }
    res.json({ photoDataUrl: null });
  });

  app.put('/api/profile-photo', (req, res) => {
    const { photoDataUrl } = req.body || {};
    writeJsonFile('profile_photo.json', { photoDataUrl: photoDataUrl || null });

    // Also keep cv_data.json's profilePhotoDataUrl synchronized
    const existingCv = readJsonFile('cv_data.json', null);
    if (existingCv && typeof existingCv === 'object') {
      existingCv.profilePhotoDataUrl = photoDataUrl || './assets/profile.jpg';
      writeJsonFile('cv_data.json', existingCv);
    }

    if (typeof photoDataUrl === 'string' && photoDataUrl.startsWith('data:image/')) {
      saveBase64ImageToAssetFiles(photoDataUrl, [
        'public/assets/profile.jpg',
        'assets/profile.jpg',
        'src/assets/images/profile.jpg',
        'dist/assets/profile.jpg',
      ]);
    }

    res.json({ photoDataUrl: photoDataUrl || null });
  });

  // ==========================================================================
  // API ROUTES FOR EDITABLE CV PERSISTENCE
  // ==========================================================================
  app.get('/api/cv', (_req, res) => {
    const cvData = readJsonFile('cv_data.json', null);
    res.json({ cvData });
  });

  app.put('/api/cv', (req, res) => {
    const { cvData } = req.body || {};
    if (!cvData) {
      res.status(400).json({ error: 'Missing cvData payload.' });
      return;
    }
    writeJsonFile('cv_data.json', cvData);

    // Sync CV photo to profile_photo.json and static profile.jpg so Hero & CV match on all phones
    if (
      typeof cvData.profilePhotoDataUrl === 'string' &&
      cvData.profilePhotoDataUrl.startsWith('data:image/')
    ) {
      writeJsonFile('profile_photo.json', { photoDataUrl: cvData.profilePhotoDataUrl });
      saveBase64ImageToAssetFiles(cvData.profilePhotoDataUrl, [
        'public/assets/profile.jpg',
        'assets/profile.jpg',
        'src/assets/images/profile.jpg',
        'dist/assets/profile.jpg',
      ]);
    }

    res.json({ cvData });
  });

  // ==========================================================================
  // API ROUTES FOR EDITABLE / DELETABLE ACADEMIC PROJECTS & PROJECT IMAGES
  // ==========================================================================
  app.get('/api/projects', (_req, res) => {
    const data = readJsonFile('projects_data.json', { projects: null, sectionMeta: null });
    const projectImages = readJsonFile('project_images.json', {});
    res.json({
      projects: data?.projects ?? null,
      sectionMeta: data?.sectionMeta ?? null,
      projectImages: projectImages && typeof projectImages === 'object' ? projectImages : {},
    });
  });

  app.put('/api/projects', (req, res) => {
    const { projects, sectionMeta, projectImages } = req.body || {};
    const payload = { projects: projects ?? null, sectionMeta: sectionMeta ?? null };
    writeJsonFile('projects_data.json', payload);

    if (projectImages && typeof projectImages === 'object') {
      writeJsonFile('project_images.json', projectImages);
    }

    if (Array.isArray(projects)) {
      for (const proj of projects) {
        if (proj && proj.id && typeof proj.imageUrl === 'string' && proj.imageUrl.startsWith('data:image/')) {
          saveBase64ImageToAssetFiles(proj.imageUrl, [
            `public/assets/projects/${proj.id}.jpg`,
            `assets/projects/${proj.id}.jpg`,
            `dist/assets/projects/${proj.id}.jpg`,
          ]);
        }
      }
    }

    res.json({
      ...payload,
      projectImages: readJsonFile('project_images.json', {}),
    });
  });

  app.get('/api/project-images', (_req, res) => {
    const projectImages = readJsonFile('project_images.json', {});
    res.json({
      projectImages: projectImages && typeof projectImages === 'object' ? projectImages : {},
    });
  });

  app.put('/api/project-images', (req, res) => {
    const { projectImages } = req.body || {};
    const cleaned: Record<string, string> = {};
    if (projectImages && typeof projectImages === 'object') {
      for (const [k, v] of Object.entries(projectImages)) {
        if (typeof v === 'string' && v !== '__REMOVED__') {
          cleaned[k] = v;
          if (v.startsWith('data:image/')) {
            saveBase64ImageToAssetFiles(v, [
              `public/assets/projects/${k}.jpg`,
              `assets/projects/${k}.jpg`,
              `dist/assets/projects/${k}.jpg`,
            ]);
          }
        }
      }
    }
    writeJsonFile('project_images.json', cleaned);
    res.json({ projectImages: cleaned });
  });

  // ==========================================================================
  // API ROUTES FOR SHORT VIDEO PERSISTENCE & STREAMING ACROSS ALL PHONES
  // ==========================================================================
  app.get('/api/short-video', (_req, res) => {
    const saved = readJsonFile('short_video.json', null);
    const uploadedVideoPath = getFilePath('uploaded_short_video.mp4');
    const hasUploadedFile = fs.existsSync(uploadedVideoPath);

    res.json({
      hasUploadedVideo: Boolean(saved?.hasUploadedVideo && hasUploadedFile),
      videoUrl:
        saved?.hasUploadedVideo && hasUploadedFile
          ? `/api/short-video/stream?t=${saved.updatedAt || 1}`
          : saved?.meta?.externalUrl || './assets/video/upendra-showcase.mp4',
      meta: saved?.meta || null,
      updatedAt: saved?.updatedAt || null,
    });
  });

  app.get('/api/short-video/stream', (_req, res) => {
    const uploadedVideoPath = getFilePath('uploaded_short_video.mp4');
    const defaultVideoPath = path.join(__dirname, 'public', 'assets', 'video', 'upendra-showcase.mp4');
    const targetPath = fs.existsSync(uploadedVideoPath) ? uploadedVideoPath : defaultVideoPath;

    if (!fs.existsSync(targetPath)) {
      res.status(404).send('Video not found');
      return;
    }

    res.sendFile(targetPath);
  });

  app.post(
    '/api/short-video/upload',
    express.raw({ type: ['video/*', 'application/octet-stream'], limit: '100mb' }),
    (req, res) => {
      try {
        let videoBuffer: Buffer | null = null;
        let fileName = String(req.headers['x-file-name'] || 'uploaded-video.mp4');

        if (Buffer.isBuffer(req.body) && req.body.length > 0) {
          videoBuffer = req.body;
        } else if (req.body && typeof req.body.videoDataUrl === 'string') {
          const base64Part = req.body.videoDataUrl.split(',')[1];
          if (base64Part) {
            videoBuffer = Buffer.from(base64Part, 'base64');
          }
          if (req.body.fileName) fileName = String(req.body.fileName);
        }

        if (!videoBuffer || videoBuffer.length === 0) {
          res.status(400).json({ error: 'Empty video payload.' });
          return;
        }

        const uploadedVideoPath = getFilePath('uploaded_short_video.mp4');
        fs.writeFileSync(uploadedVideoPath, videoBuffer);

        // Also mirror to static video paths so static /assets/video/upendra-showcase.mp4 also serves it
        for (const rel of [
          'public/assets/video/upendra-showcase.mp4',
          'assets/video/upendra-showcase.mp4',
          'dist/assets/video/upendra-showcase.mp4',
        ]) {
          try {
            const full = path.join(__dirname, rel);
            fs.mkdirSync(path.dirname(full), { recursive: true });
            fs.writeFileSync(full, videoBuffer);
          } catch {
            // Ignore if read-only
          }
        }

        const updatedAt = Date.now();
        const existing = readJsonFile('short_video.json', {});
        const nextRecord = {
          hasUploadedVideo: true,
          updatedAt,
          meta: {
            ...(existing?.meta || {}),
            fileName,
            externalUrl: `/api/short-video/stream?t=${updatedAt}`,
            hideDefaultVideo: false,
          },
        };
        writeJsonFile('short_video.json', nextRecord);

        res.json({
          hasUploadedVideo: true,
          videoUrl: `/api/short-video/stream?t=${updatedAt}`,
          meta: nextRecord.meta,
          updatedAt,
        });
      } catch (err) {
        console.error('Error saving uploaded video:', err);
        res.status(500).json({ error: 'Failed to save video on server.' });
      }
    }
  );

  app.put('/api/short-video/meta', (req, res) => {
    const { meta, clearUploadedVideo } = req.body || {};
    const existing = readJsonFile('short_video.json', {});
    if (clearUploadedVideo) {
      try {
        const uploadedVideoPath = getFilePath('uploaded_short_video.mp4');
        if (fs.existsSync(uploadedVideoPath)) {
          fs.unlinkSync(uploadedVideoPath);
        }
      } catch {}
    }

    const updatedAt = Date.now();
    const nextRecord = {
      hasUploadedVideo: clearUploadedVideo ? false : Boolean(existing?.hasUploadedVideo),
      updatedAt,
      meta: meta || existing?.meta || null,
    };
    writeJsonFile('short_video.json', nextRecord);
    res.json(nextRecord);
  });

  // ==========================================================================
  // API ROUTES FOR CERTIFICATES, BLOG & PRIVACY-FRIENDLY ANALYTICS
  // ==========================================================================
  app.get('/api/certificates', (_req, res) => {
    const certificates = readJsonFile('certificates.json', []);
    res.json({ certificates: Array.isArray(certificates) ? certificates : [] });
  });

  app.put('/api/certificates', (req, res) => {
    const { certificates } = req.body || {};
    const valid = Array.isArray(certificates) ? certificates : [];
    writeJsonFile('certificates.json', valid);
    res.json({ certificates: valid });
  });

  app.get('/api/blog', (_req, res) => {
    const articles = readJsonFile('blog_articles.json', null);
    res.json({ articles: Array.isArray(articles) ? articles : null });
  });

  app.put('/api/blog', (req, res) => {
    const { articles } = req.body || {};
    const valid = Array.isArray(articles) ? articles : [];
    writeJsonFile('blog_articles.json', valid);
    res.json({ articles: valid });
  });

  app.post('/api/analytics/view', (_req, res) => {
    const stats = readJsonFile('analytics.json', { views: 124 });
    const nextViews = (typeof stats?.views === 'number' ? stats.views : 124) + 1;
    writeJsonFile('analytics.json', { views: nextViews, updatedAt: new Date().toISOString() });
    res.json({ views: nextViews });
  });

  app.get('/api/analytics', (_req, res) => {
    const stats = readJsonFile('analytics.json', { views: 124 });
    res.json({ views: typeof stats?.views === 'number' ? stats.views : 124 });
  });

  // ==========================================================================
  // SERVER-SIDE AI PORTFOLIO ASSISTANT (/api/chat) WITH DEMO FALLBACK
  // ==========================================================================
  app.post('/api/chat', async (req, res) => {
    const userMessage = String(req.body?.message || '').trim();
    if (!userMessage) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userMessage,
          config: {
            systemInstruction: `You are the official AI Portfolio Assistant for Upendra Bahadur Budha.
Answer concisely, politely, and truthfully based ONLY on these verified facts:
- Name: Upendra Bahadur Budha
- Education: BSc IT student specializing in Cloud Computing at LBEF College (Lord Buddha Education Foundation), Nepal.
- Career Goal: Aspiring IT professional and technology entrepreneur.
- Core Skills & Interests: Cloud Computing, Cisco Networking, Cybersecurity, Web Development (HTML5, CSS3, JavaScript), Video Editing, and Content Creation.
- Academic Projects & Coursework Concepts (not commercial products):
  1. Nepal Invest (Conceptual IPO & investment tracking platform)
  2. Clothing Marketplace (E-commerce & social-commerce website concept)
  3. Smart Home (IoT & home automation coursework concept)
  4. Emergency Response Robot (Robotics sensor & camera telemetry concept)
  5. Student Event Website (College event portal coursework using HTML, CSS, JS)
- Official Links & Contact:
  - GitHub: https://github.com/upendrabudha505-tech (@upendrabudha505-tech)
  - LinkedIn: https://www.linkedin.com/in/upendra-budha-6b9240329
  - Credly: https://www.credly.com/users/upendra-bahadur-budha
  - Instagram: https://www.instagram.com/upendrabudha505/
  - Facebook: https://www.facebook.com/bu.d.ha.776337
  - Email: upendrabudha505@gmail.com
  - Phone: 9701269514
Never invent fake work experience, fake certificates, or fake commercial projects.`,
          },
        });

        const replyText = response.text?.trim();
        if (replyText) {
          res.json({ reply: replyText, mode: 'ai' });
          return;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to demo mode:', err);
      }
    }

    // Working Demo Mode fallback when no API key is configured
    const q = userMessage.toLowerCase();
    let demoReply =
      'Upendra Bahadur Budha is a BSc IT student specializing in Cloud Computing at LBEF College, Nepal, with a goal of becoming an IT professional and entrepreneur. You can ask me about his skills, academic projects, GitHub (github.com/upendrabudha505-tech), or contact details!';

    if (q.includes('skill') || q.includes('cloud') || q.includes('network') || q.includes('cyber')) {
      demoReply =
        'Upendra focuses on Cloud Computing (his BSc IT specialization), Cisco Networking, Cybersecurity fundamentals, Web Development (HTML5, CSS3, JavaScript), Video Editing, and Content Creation.';
    } else if (q.includes('project') || q.includes('nepal invest') || q.includes('smart home') || q.includes('robot')) {
      demoReply =
        'Upendra’s academic projects and coursework concepts include:\n• Nepal Invest (IPO & investment concept)\n• Clothing Marketplace (E-commerce concept)\n• Smart Home (Automation & IoT concept)\n• Emergency Response Robot (Robotics telemetry concept)\n• Student Event Website (HTML/CSS/JS coursework).';
    } else if (q.includes('github') || q.includes('code') || q.includes('repo')) {
      demoReply =
        'Upendra’s official GitHub profile is https://github.com/upendrabudha505-tech (@upendrabudha505-tech). You can also explore the live GitHub Activity section on this page.';
    } else if (q.includes('instagram') || q.includes('linkedin') || q.includes('social') || q.includes('credly')) {
      demoReply =
        'Connect with Upendra on:\n• GitHub: https://github.com/upendrabudha505-tech\n• LinkedIn: https://www.linkedin.com/in/upendra-budha-6b9240329\n• Instagram: https://www.instagram.com/upendrabudha505/\n• Credly: https://www.credly.com/users/upendra-bahadur-budha';
    } else if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire')) {
      demoReply =
        'You can reach Upendra Bahadur Budha at:\n• Email: upendrabudha505@gmail.com\n• Phone: 9701269514\n• Or by submitting a message in the Contact Me section below.';
    } else if (q.includes('education') || q.includes('college') || q.includes('lbef') || q.includes('study')) {
      demoReply =
        'Upendra is pursuing his Bachelor of Science in Information Technology (BSc IT) specializing in Cloud Computing at LBEF College (Lord Buddha Education Foundation) in Nepal.';
    }

    res.json({ reply: demoReply, mode: 'demo' });
  });

  // ==========================================================================
  // VITE MIDDLEWARE (DEVELOPMENT) OR STATIC ASSETS (PRODUCTION)
  // ==========================================================================
  const distPath = path.join(__dirname, 'dist');
  const useProdStatic =
    process.env.NODE_ENV === 'production' && fs.existsSync(path.join(distPath, 'index.html'));

  if (!useProdStatic) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
