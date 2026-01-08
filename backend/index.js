import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/authRoutes.js';
import denunciaRoutes from './routes/denunciaRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import autoridadRoutes from './routes/autoridadRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Configurar CORS
app.use((req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || '*';
  
  // Si es *, permitir cualquier origen
  if (frontendUrl === '*') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      ...frontendUrl.split(',').map(url => url.trim())
    ].filter(Boolean);

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.originalUrl}`);
    next();
});

app.use(express.json({ limit: '50mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));
app.get('/', (req, res) => res.send('API Backend is running!'));

// --- SETUP DATABASE ENDPOINT (KEPT FOR DEV) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/api/db-init', async (req, res) => {
  try {
    const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');

    if (!fs.existsSync(sqlPath)) {
      return res.status(404).json({ error: 'init.sql not found', path: sqlPath });
    }

    try {
      await pool.query('SELECT NOW()');
    } catch (dbErr) {
      return res.status(500).json({ error: 'Database connection failed', details: dbErr });
    }

    let sql = fs.readFileSync(sqlPath, 'utf8');
    sql = sql.replace(/^\uFEFF/, '');

    await pool.query(sql);

    res.json({ success: true, message: 'Database initialized successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Initialization failed', details: err.message });
  }
});

// --- MOUNT ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/denuncias', denunciaRoutes);
app.use('/api/ciudadanos', usuarioRoutes);
app.use('/api/autoridades', autoridadRoutes);
app.use('/api/notificaciones', notificationRoutes);

app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));
