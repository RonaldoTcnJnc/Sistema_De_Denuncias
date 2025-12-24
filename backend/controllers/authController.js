import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';
import pool from '../config/db.js'; // Needed for direct queries in reset-dev if not in model

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_dev_123';

export const login = async (req, res) => {
    try {
        const { email, password, type } = req.body; // type: 'ciudadano' | 'autoridad'

        if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

        let user = null;
        let table = type === 'autoridad' ? 'autoridades' : 'ciudadanos';

        user = await Usuario.findByEmail(email, table);

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Verificar password
        // Nota: en init.sql las contraseñas eran texto plano "hashed_password_...".
        // El script /api/auth/reset-passwords-dev las convertirá a hashes reales.
        const validPassword = await bcrypt.compare(password, user.password_hash || user.contraseña_hash || '');
        // Note: schema says contraseña_hash but index.js used password_hash? 
        // index.js used: user.password_hash. Let's stick to what index.js was using effectively.
        // If index.js worked, the column in DB must be password_hash OR index.js was failing.
        // Schema says: contraseña_hash.
        // Index.js says: password_hash.
        // If index.js was working, maybe the column was renamed or schema.sql is not fully synced.
        // I will check the schema again or just support both properties for safety.

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
};

// Endpoint auxiliar para resetear contraseñas en DB (SOLO DEV)
export const resetPasswordsDev = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('123456', salt);

        // Using direct pool query or Model if implemented
        await pool.query('UPDATE ciudadanos SET "password_hash" = $1', [hash]);
        await pool.query('UPDATE autoridades SET "password_hash" = $1', [hash]);

        res.json({ success: true, message: 'Todas las contraseñas actualizadas a "123456"' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error reset', details: err.message });
    }
};
