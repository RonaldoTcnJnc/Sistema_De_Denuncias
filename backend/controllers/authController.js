import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';
import pool from '../config/db.js';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_dev_123';

export const login = async (req, res) => {
    try {
        const { email, password, type } = req.body; // type: 'ciudadano' | 'autoridad' | undefined

        if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

        let user = null;
        let userType = type; // Will be determined if not provided

        // If type is not provided, search in both tables
        if (!type) {
            // Try ciudadanos first
            user = await Usuario.findByEmail(email, 'ciudadanos');
            if (user) {
                userType = 'ciudadano';
            } else {
                // Try autoridades
                user = await Usuario.findByEmail(email, 'autoridades');
                if (user) {
                    userType = 'autoridad';
                }
            }
        } else {
            // Type is provided, search in specific table
            const table = type === 'autoridad' ? 'autoridades' : 'ciudadanos';
            user = await Usuario.findByEmail(email, table);
            userType = type;
        }

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Verificar password
        const validPassword = await bcrypt.compare(password, user.password_hash || user.contraseña_hash || '');

        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: userType === 'autoridad' ? user.rol : 'ciudadano', tipo: userType },
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
                role: userType === 'autoridad' ? user.rol : 'ciudadano',
                tipo: userType // Return user type so frontend knows where to redirect
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error de servidor', details: err.message });
    }
};



export const register = async (req, res) => {
    try {
        const { fullName, email, dni, phone, address, password } = req.body;

        // Validaciones básicas
        if (!fullName || !email || !dni || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        // Verificar si existe email
        const existingEmail = await Usuario.findByEmail(email, 'ciudadanos');
        if (existingEmail) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Verificar si existe DNI
        const existingDni = await Usuario.findByDni(dni);
        if (existingDni) {
            return res.status(400).json({ error: 'El DNI ya está registrado' });
        }

        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const contraseña_hash = await bcrypt.hash(password, salt);

        // Crear usuario
        const newUser = await Usuario.create({
            nombre_completo: fullName,
            email,
            dni,
            telefono: phone,
            direccion: address,
            ciudad: 'Cusco', // Valor por defecto o agregar al form
            distrito: 'Centro', // Valor por defecto o agregar al form
            contraseña_hash
        });

        // Generar token para login automático
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: 'ciudadano', tipo: 'ciudadano' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser.id,
                nombre: newUser.nombre_completo,
                email: newUser.email,
                role: 'ciudadano',
                tipo: 'ciudadano'
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar usuario', details: err.message });
    }
};

// Endpoint auxiliar para resetear contraseñas en DB (SOLO DEV)
export const resetPasswordsDev = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('123456', salt);

        // Using direct pool query or Model if implemented
        await pool.query('UPDATE ciudadanos SET "contraseña_hash" = $1', [hash]);
        await pool.query('UPDATE autoridades SET "contraseña_hash" = $1', [hash]);

        res.json({ success: true, message: 'Todas las contraseñas actualizadas a "123456"' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error reset', details: err.message });
    }
};

// Endpoint para consultar DNI real usando Graph Perú (REST)
export const checkDni = async (req, res) => {
    try {
        const { dni } = req.body;
        if (!dni || dni.length !== 8) {
            return res.status(400).json({ error: 'DNI inválido' });
        }

        // Según documentación: GET https://graphperu.daustinn.com/api/query/{dni}
        const url = `https://graphperu.daustinn.com/api/query/${dni}`;

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const data = response.data;

        if (data && !data.error) {
            // La API devuelve: names, surnames, fullName... (minusculas)
            const nombreCompleto = data.fullName || `${data.names} ${data.surnames}`;

            res.json({
                success: true,
                data: {
                    nombre_completo: nombreCompleto.trim(), // Limpiar espacios
                    dni: data.documentID || dni
                }
            });
        } else {
            res.status(404).json({ error: 'DNI no encontrado o error en API externa' });
        }

    } catch (err) {
        console.error("Error API DNI:", err.message);
        if (err.response) {
            console.error("API response error:", err.response.data);
            if (err.response.status === 404) return res.status(404).json({ error: 'DNI no encontrado' });
            if (err.response.status === 429) return res.status(429).json({ error: 'Límite de consultas excedido' });
        }
        res.status(500).json({ error: 'Error al consultar DNI externo', details: err.message });
    }
};
