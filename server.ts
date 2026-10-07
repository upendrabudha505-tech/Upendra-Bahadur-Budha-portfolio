import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const CV_DATA_FILE = path.join(DATA_DIR, 'cv_data.json');
const PROJECTS_DATA_FILE = path.join(DATA_DIR, 'projects_data.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readMessages() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeMessages(messages: unknown[]) {
  ensureDataDir();
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // ==========================================================================
  // API ROUTES FOR VISITOR MESSAGES INBOX
  // ==========================================================================
  app.get('/api/messages', (_req, res) => {
    const messages = readMessages();
    res.json({ messages });
  });

  app.post('/api/messages', (req, res) => {
    const { fullName, email, subject, message } = req.body || {};
    if (!fullName || !email || !subject || !message) {
      res.status(400).json({ error: 'All fields (fullName, email, subject, message) are required.' });
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

    const existing = readMessages();
    const updated = [newMsg, ...existing];
    writeMessages(updated);
    res.status(201).json({ message: newMsg, messages: updated });
  });

  app.patch('/api/messages/:id/read', (req, res) => {
    const { id } = req.params;
    const existing = readMessages();
    const updated = existing.map((m: { id: string; read?: boolean }) =>
      m.id === id ? { ...m, read: true } : m
    );
    writeMessages(updated);
    res.json({ messages: updated });
  });

  app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    const existing = readMessages();
    const updated = existing.filter((m: { id: string }) => m.id !== id);
    writeMessages(updated);
    res.json({ messages: updated });
  });

  // ==========================================================================
  // API ROUTES FOR EDITABLE CV PERSISTENCE
  // ==========================================================================
  app.get('/api/cv', (_req, res) => {
    ensureDataDir();
    if (!fs.existsSync(CV_DATA_FILE)) {
      res.json({ cvData: null });
      return;
    }
    try {
      const raw = fs.readFileSync(CV_DATA_FILE, 'utf-8');
      res.json({ cvData: JSON.parse(raw) });
    } catch {
      res.json({ cvData: null });
    }
  });

  app.put('/api/cv', (req, res) => {
    ensureDataDir();
    const { cvData } = req.body || {};
    if (!cvData) {
      res.status(400).json({ error: 'Missing cvData payload.' });
      return;
    }
    fs.writeFileSync(CV_DATA_FILE, JSON.stringify(cvData, null, 2), 'utf-8');
    res.json({ cvData });
  });

  // ==========================================================================
  // API ROUTES FOR EDITABLE / DELETABLE ACADEMIC PROJECTS PERSISTENCE
  // ==========================================================================
  app.get('/api/projects', (_req, res) => {
    ensureDataDir();
    if (!fs.existsSync(PROJECTS_DATA_FILE)) {
      res.json({ projects: null, sectionMeta: null });
      return;
    }
    try {
      const raw = fs.readFileSync(PROJECTS_DATA_FILE, 'utf-8');
      res.json(JSON.parse(raw));
    } catch {
      res.json({ projects: null, sectionMeta: null });
    }
  });

  app.put('/api/projects', (req, res) => {
    ensureDataDir();
    const { projects, sectionMeta } = req.body || {};
    const payload = { projects: projects ?? null, sectionMeta: sectionMeta ?? null };
    fs.writeFileSync(PROJECTS_DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    res.json(payload);
  });

  // ==========================================================================
  // VITE MIDDLEWARE (DEVELOPMENT) OR STATIC ASSETS (PRODUCTION)
  // ==========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
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
