import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '20mb' }));

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
    const { fullName, email, subject, message } = req.body || {};
    if (!fullName || !email || !subject || !message) {
      res
        .status(400)
        .json({ error: 'All fields (fullName, email, subject, message) are required.' });
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
    res.json(data || { photoDataUrl: null });
  });

  app.put('/api/profile-photo', (req, res) => {
    const { photoDataUrl } = req.body || {};
    writeJsonFile('profile_photo.json', { photoDataUrl: photoDataUrl || null });

    // If a base64 image data URL was uploaded, also write it to public/assets/profile.jpg
    if (typeof photoDataUrl === 'string' && photoDataUrl.startsWith('data:image/')) {
      try {
        const base64Part = photoDataUrl.split(',')[1];
        if (base64Part) {
          const buf = Buffer.from(base64Part, 'base64');
          const publicAssetPath = path.join(__dirname, 'public', 'assets', 'profile.jpg');
          const rootAssetPath = path.join(__dirname, 'assets', 'profile.jpg');
          fs.mkdirSync(path.dirname(publicAssetPath), { recursive: true });
          fs.writeFileSync(publicAssetPath, buf);
          fs.mkdirSync(path.dirname(rootAssetPath), { recursive: true });
          fs.writeFileSync(rootAssetPath, buf);
        }
      } catch {
        // Ignore file write error if read-only container
      }
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
    res.json({ cvData });
  });

  // ==========================================================================
  // API ROUTES FOR EDITABLE / DELETABLE ACADEMIC PROJECTS PERSISTENCE
  // ==========================================================================
  app.get('/api/projects', (_req, res) => {
    const data = readJsonFile('projects_data.json', { projects: null, sectionMeta: null });
    res.json(data || { projects: null, sectionMeta: null });
  });

  app.put('/api/projects', (req, res) => {
    const { projects, sectionMeta } = req.body || {};
    const payload = { projects: projects ?? null, sectionMeta: sectionMeta ?? null };
    writeJsonFile('projects_data.json', payload);
    res.json(payload);
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
