import express from 'express';
import dotenv from 'dotenv';
import pool from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_dev_123';

// ... (existing CORS setup)

// Configurar CORS manualmente (sin dependencias adicionales)
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));

// --- SETUP DATABASE ENDPOINT (TEMPORAL) ---
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/api/db-init', async (req, res) => {
  try {
    const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');

    // 1. Check file existence
    if (!fs.existsSync(sqlPath)) {
      return res.status(404).json({ error: 'init.sql not found', path: sqlPath });
    }

    // 2. Test DB Connection
    try {
      await pool.query('SELECT NOW()');
    } catch (dbErr) {
      return res.status(500).json({
        error: 'Database connection failed',
        details: JSON.stringify(dbErr, Object.getOwnPropertyNames(dbErr))
      });
    }

    // 3. Execute SQL
    let sql = fs.readFileSync(sqlPath, 'utf8');
    // Remove BOM (Byte Order Mark) if present - fixes "syntax error at or near... "
    sql = sql.replace(/^\uFEFF/, '');

    await pool.query(sql);

    res.json({ success: true, message: 'Database initialized successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Initialization failed',
      details: JSON.stringify(err, Object.getOwnPropertyNames(err)),
      message: err.message
    });
  }
});
// ------------------------------------------

// Obtener denuncias
// Obtener denuncias (Global - Limitado a 100)
app.get('/api/denuncias', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, ciudadano_id, titulo, descripcion, categoria, ubicacion, distrito, estado, fecha_reporte, prioridad FROM denuncias ORDER BY fecha_reporte DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener denuncias' });
  }
});

// Obtener denuncias de un ciudadano específico
app.get('/api/denuncias/ciudadano/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, ciudadano_id, titulo, descripcion, categoria, ubicacion, distrito, estado, fecha_reporte, prioridad, fecha_resolucion FROM denuncias WHERE ciudadano_id = $1 ORDER BY fecha_reporte DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
<<<<<<< HEAD
    console.error('Error fetching user reports:', err);
    res.status(500).json({ error: 'Error al obtener denuncias del usuario' });
=======
    console.error(err);
    res.status(500).json({ error: 'Error al obtener denuncias del ciudadano' });
>>>>>>> d2fb554c95361e7ba8905058eb37d04bccff12ad
  }
});

// Crear nueva denuncia (simple)
app.post('/api/denuncias', async (req, res) => {
  try {
    const { ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, prioridad } = req.body;
    const q = `INSERT INTO denuncias (ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, prioridad) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
    const values = [ciudadano_id || null, titulo, descripcion, categoria, ubicacion, latitud || null, longitud || null, distrito || null, prioridad || 'Media'];
    const result = await pool.query(q, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear denuncia' });
  }
});

// Obtener ciudadanos
app.get('/api/ciudadanos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre_completo, email, telefono, ciudad, distrito, fecha_registro FROM ciudadanos ORDER BY fecha_registro DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ciudadanos' });
  }
});

// Obtener autoridades
app.get('/api/autoridades', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre_completo, email, departamento, cargo, rol, distrito_asignado FROM autoridades ORDER BY nombre_completo');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener autoridades' });
  }
});

// Endpoint simple para asignar denuncia (crea registro en asignacion_denuncia)
app.post('/api/asignar', async (req, res) => {
  try {
    const { denuncia_id, autoridad_id, notas_internas } = req.body;
    const q = `INSERT INTO asignacion_denuncia (denuncia_id, autoridad_id, notas_internas) VALUES ($1,$2,$3) RETURNING *`;
    const result = await pool.query(q, [denuncia_id, autoridad_id, notas_internas || null]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al asignar denuncia' });
  }
});
// --- AUTHENTICATION ---

// Endpoint auxiliar para resetear contraseñas en DB (SOLO DEV)
app.get('/api/auth/reset-passwords-dev', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123456', salt);

    await pool.query('UPDATE ciudadanos SET "password_hash" = $1', [hash]);
    await pool.query('UPDATE autoridades SET "password_hash" = $1', [hash]);

    res.json({ success: true, message: 'Todas las contraseñas actualizadas a "123456"' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error reset', details: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, type } = req.body; // type: 'ciudadano' | 'autoridad'

    if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

    let user = null;
    let table = type === 'autoridad' ? 'autoridades' : 'ciudadanos';

    // Buscar usuario
    const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    user = result.rows[0];

    // Verificar password
    // Nota: en init.sql las contraseñas eran texto plano "hashed_password_...".
    // El script /api/auth/reset-passwords-dev las convertirá a hashes reales.
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: type === 'autoridad' ? user.rol : 'ciudadano' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nombre: user.nombre_completo,
        email: user.email,
        role: type === 'autoridad' ? user.rol : 'ciudadano'
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de servidor', details: err.message });
  }
});

// GET /api/ciudadanos/:id - Obtener perfil de ciudadano específico
app.get('/api/ciudadanos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, nombre_completo, email, telefono, direccion, ciudad, distrito, fecha_registro, verificado, fotografia_perfil, notificaciones_email, notificaciones_push, boletin_informativo FROM ciudadanos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ciudadano no encontrado' });
    }

    const user = result.rows[0];

    // Convertir BYTEA (Buffer) a string (Data URI) si existe
    if (user.fotografia_perfil) {
      user.fotografia_perfil = user.fotografia_perfil.toString('utf-8');
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching citizen profile:', err);
    res.status(500).json({ error: 'Error al obtener perfil', details: err.message });
  }
});

// PUT /api/ciudadanos/:id - Actualizar perfil de ciudadano (incluyendo foto)
app.put('/api/ciudadanos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, telefono, direccion, ciudad, distrito, fotografia_perfil } = req.body;

    let q, params;

    // Si se envía foto, la guardamos (asumiendo que viene como Data URI string)
    // Convertimos el string a Buffer para guardar en BYTEA
    if (fotografia_perfil) {
      const imageBuffer = Buffer.from(fotografia_perfil, 'utf-8');
      q = `UPDATE ciudadanos
            SET nombre_completo = $1, telefono = $2, direccion = $3, ciudad = $4, distrito = $5, fotografia_perfil = $6, updated_at = NOW()
            WHERE id = $7
            RETURNING id, nombre_completo, email, telefono, direccion, ciudad, distrito, fecha_registro, verificado`;
      params = [nombre_completo, telefono, direccion, ciudad, distrito, imageBuffer, id];
    } else {
      q = `UPDATE ciudadanos
            SET nombre_completo = $1, telefono = $2, direccion = $3, ciudad = $4, distrito = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING id, nombre_completo, email, telefono, direccion, ciudad, distrito, fecha_registro, verificado`;
      params = [nombre_completo, telefono, direccion, ciudad, distrito, id];
    }

    const result = await pool.query(q, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si guardamos foto, devolvemos el string original para que el front actualice el estado sin recargar
    // (La consulta RETURNING no devuelve columas BYTEA en formato útil directamente sin proceso, 
    //  así que simplemente confirmamos los datos)
    const updatedUser = result.rows[0];
    if (fotografia_perfil) updatedUser.fotografia_perfil = fotografia_perfil;

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Error al actualizar perfil', details: err.message });
  }
});

// PUT /api/ciudadanos/:id/preferences - Actualizar preferencias
app.put('/api/ciudadanos/:id/preferences', async (req, res) => {
  try {
    const { id } = req.params;
    const { notificaciones_email, notificaciones_push, boletin_informativo } = req.body;

    const result = await pool.query(
      `UPDATE ciudadanos
       SET notificaciones_email = $1, notificaciones_push = $2, boletin_informativo = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING notificaciones_email, notificaciones_push, boletin_informativo`,
      [notificaciones_email, notificaciones_push, boletin_informativo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, preferences: result.rows[0] });
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ error: 'Error al actualizar preferencias', details: err.message });
  }
});

// PUT /api/ciudadanos/:id/password - Cambiar contraseña
app.put('/api/ciudadanos/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const userResult = await pool.query('SELECT password_hash FROM ciudadanos WHERE id = $1', [id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE ciudadanos SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, id]
    );

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
});

// DELETE /api/ciudadanos/:id - Eliminar cuenta
app.delete('/api/ciudadanos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // La base de datos está configurada con CASCADE DELETE, así que borrar el ciudadano
    // borrará automáticamente sus denuncias, notificaciones, etc.
    const result = await pool.query('DELETE FROM ciudadanos WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Cuenta eliminada correctamente' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
});

// PUT /api/denuncias/:id - Actualizar estado de denuncia
app.put('/api/denuncias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, prioridad } = req.body;

    const result = await pool.query(
      `UPDATE denuncias 
       SET estado = $1, prioridad = $2
       WHERE id = $3
       RETURNING *`,
      [estado, prioridad, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Denuncia no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating denuncia:', err);
    res.status(500).json({ error: 'Error al actualizar denuncia' });
  }
});

// ----------------------

app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));
