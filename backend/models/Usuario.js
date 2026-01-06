import pool from '../config/db.js';

export const Usuario = {
    // Buscar usuario por email en tabla específica (ciudadanos o autoridades)
    findByEmail: async (email, table) => {
        const result = await pool.query('SELECT * FROM sp_usuario_find_by_email($1, $2)', [email, table]);
        return result.rows[0];
    },

    // Buscar usuario por DNI (solo ciudadanos)
    findByDni: async (dni) => {
        const result = await pool.query('SELECT * FROM sp_ciudadano_find_by_dni($1)', [dni]);
        return result.rows[0];
    },

    create: async (data) => {
        const { nombre_completo, email, dni, telefono, direccion, ciudad, distrito, password_hash } = data;
        const result = await pool.query(
            'SELECT * FROM sp_ciudadano_create($1, $2, $3, $4, $5, $6, $7, $8)',
            [nombre_completo, email, dni, telefono, direccion, ciudad, distrito, password_hash]
        );
        return result.rows[0];
    },

    findById: async (id, table = 'ciudadanos') => {
        const result = await pool.query('SELECT * FROM sp_usuario_find_by_id($1, $2)', [id, table]);
        return result.rows[0];
    },

    update: async (id, data) => {
        const { nombre_completo, telefono, direccion, ciudad, distrito, fotografia_perfil } = data;
        let imageBuffer = null;
        if (fotografia_perfil) {
            imageBuffer = Buffer.from(fotografia_perfil, 'utf-8');
        }

        const result = await pool.query(
            'SELECT * FROM sp_ciudadano_update($1, $2, $3, $4, $5, $6, $7)',
            [id, nombre_completo, telefono, direccion, ciudad, distrito, imageBuffer]
        );
        return result.rows[0];
    },

    updatePreferences: async (id, { notificaciones_email, notificaciones_push, boletin_informativo }) => {
        const result = await pool.query(
            'SELECT * FROM sp_ciudadano_update_preferences($1, $2, $3, $4)',
            [id, notificaciones_email, notificaciones_push, boletin_informativo]
        );
        return result.rows[0];
    },

    updatePassword: async (id, newHash, table = 'ciudadanos') => {
        await pool.query('SELECT sp_usuario_update_password($1, $2, $3)', [id, newHash, table]);
    },

    getPasswordHash: async (id, table = 'ciudadanos') => {
        const result = await pool.query('SELECT * FROM sp_usuario_get_password_hash($1, $2)', [id, table]);
        return result.rows[0]?.password_hash;
    },

    delete: async (id) => {
        const result = await pool.query('SELECT * FROM sp_ciudadano_delete($1)', [id]);
        return result.rows[0];
    },

    getAll: async (limit = 100) => {
        const result = await pool.query('SELECT * FROM sp_ciudadano_get_all($1)', [limit]);
        return result.rows;
    },

    findAllAutoridades: async () => {
        const result = await pool.query('SELECT * FROM sp_autoridad_get_all()');
        return result.rows;
    }
};
