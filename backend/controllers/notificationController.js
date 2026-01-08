import pool from '../config/db.js';

export const getNotifications = async (req, res) => {
    try {
        const { id } = req.params; // Using params if passed, or could be from auth token in a real secure app
        const citizenId = id || req.query.citizen_id; // Flexible for now

        if (!citizenId) {
            return res.status(400).json({ error: 'Citizen ID is required' });
        }

        const result = await pool.query('SELECT * FROM sp_notificacion_get_by_citizen($1)', [citizenId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
};

export const markRead = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('SELECT sp_notificacion_mark_read($1)', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error marking notification read:', err);
        res.status(500).json({ error: 'Error al marcar notificación como leída' });
    }
};

export const markAllRead = async (req, res) => {
    try {
        const { citizenId } = req.body;
        await pool.query('SELECT sp_notificacion_mark_all_read($1)', [citizenId]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error marking all notifications read:', err);
        res.status(500).json({ error: 'Error al marcar todas como leídas' });
    }
};
