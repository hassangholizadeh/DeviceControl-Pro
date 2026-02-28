import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const defaultAdminUser = {
  id: 1,
  username: 'admin',
  password: hashPassword('admin'),
  registerSystem: 'edit',
  registerPrinter: 'edit',
  listSystem: 'edit',
  listPrinter: 'edit',
  repairPrinter: true,
  repairSystem: true,
  repairPrinterList: true,
  repairSystemList: true,
  inventory: true,
  reports: true,
  dashboard: true,
  import: true,
  created: new Date().toLocaleDateString('fa-IR')
};

const initializeData = () => {
  let data: any = {
    systems: [],
    printers: [],
    users: [],
    parts: [],
    consumables: [],
    repairs: [],
    auditLogs: [],
    lifecycleEvents: [],
    definitions: {}
  };

  if (fs.existsSync(DATA_FILE)) {
    try {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading existing data file, initializing new one:', error);
    }
  }

  // Ensure default admin user exists if users array is empty
  if (!data.users || data.users.length === 0) {
    data.users = [defaultAdminUser];
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Initialized db.json with default admin user.');
  } else if (!fs.existsSync(DATA_FILE)) {
     // If file didn't exist but we somehow have data (unlikely unless logic changes), write it
     fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }
};

// Initialize on startup
initializeData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' })); // Increase limit for large data

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API Routes for Data Persistence
  app.get('/api/data', (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        res.json(JSON.parse(data));
      } else {
        // Should not happen due to initialization, but safe fallback
        res.json({ users: [defaultAdminUser] });
      }
    } catch (error) {
      console.error('Error reading data:', error);
      res.status(500).json({ error: 'Failed to read data' });
    }
  });

  app.post('/api/data', (req, res) => {
    try {
      const data = req.body;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error('Error writing data:', error);
      res.status(500).json({ error: 'Failed to save data' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
