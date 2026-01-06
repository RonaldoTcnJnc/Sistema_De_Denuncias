import { Usuario } from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js'; // For direct query if needed for autoridades

export const getCiudadanoProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Usuario.findById(id, 'ciudadanos');

        if (!user) {
            return res.status(404).json({ error: 'Ciudadano no encontrado' });
        }

        // Convertir BYTEA (Buffer) a string (Data URI) si existe
        if (user.fotografia_perfil) {
            user.fotografia_perfil = user.fotografia_perfil.toString('utf-8');
        }

        res.json(user);
    } catch (err) {
        console.error('Error fetching citizen profile:', err);
        res.status(500).json({ error: 'Error al obtener perfil', details: err.message });
    }
};

export const updateCiudadanoProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await Usuario.update(id, req.body);

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { fotografia_perfil } = req.body;
        if (fotografia_perfil) updatedUser.fotografia_perfil = fotografia_perfil;

        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Error al actualizar perfil', details: err.message });
    }
};

export const updatePreferences = async (req, res) => {
    try {
        const { id } = req.params;
        const preferences = await Usuario.updatePreferences(id, req.body);

        if (!preferences) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ success: true, preferences });
    } catch (err) {
        console.error('Error updating preferences:', err);
        res.status(500).json({ error: 'Error al actualizar preferencias', details: err.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const currentHash = await Usuario.getPasswordHash(id);

        if (!currentHash) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isValid = await bcrypt.compare(currentPassword, currentHash);

        if (!isValid) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        await Usuario.updatePassword(id, newHash);

        res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Usuario.delete(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ success: true, message: 'Cuenta eliminada correctamente' });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ error: 'Error al eliminar cuenta' });
    }
};

export const searchByDNI = async (req, res) => {
    try {
        const { dni } = req.params;
        const user = await Usuario.findByDni(dni);

        if (!user) {
            return res.status(404).json({ error: 'Ciudadano no encontrado' });
        }

        // Return public info or needed info
        res.json({
            id: user.id,
            nombre_completo: user.nombre_completo,
            email: user.email,
            dni: user.dni,
            verificado: user.verificado
        });
    } catch (err) {
        console.error('Error searching citizen by DNI:', err);
        res.status(500).json({ error: 'Error al buscar ciudadano' });
    }
};

export const getCiudadanos = async (req, res) => {
    try {
        const users = await Usuario.getAll(100);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener ciudadanos' });
    }
};

export const getAutoridades = async (req, res) => {
    try {
        const autoridades = await Usuario.findAllAutoridades();
        res.json(autoridades);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener autoridades' });
    }
};
