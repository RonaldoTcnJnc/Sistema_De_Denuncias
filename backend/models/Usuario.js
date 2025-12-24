import pool from '../config/db.js';

export const Usuario = {
    // Buscar usuario por email en tabla específica (ciudadanos o autoridades)
    findByEmail: async (email, table) => {
        const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);
        return result.rows[0];
    },

    findById: async (id, table = 'ciudadanos') => {
        // Campos específicos para ciudadano
        const query = table === 'ciudadanos'
            ? 'SELECT id, nombre_completo, email, telefono, direccion, ciudad, distrito, fecha_registro, verificado, fotografia_perfil, notificaciones_email, notificaciones_push, boletin_informativo FROM ciudadanos WHERE id = $1'
            : 'SELECT id, nombre_completo, email, departamento, cargo, rol, distrito_asignado FROM autoridades WHERE id = $1';

        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    update: async (id, data) => {
        const { nombre_completo, telefono, direccion, ciudad, distrito, fotografia_perfil } = data;
        let q, params;

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
        return result.rows[0];
    },

    updatePreferences: async (id, { notificaciones_email, notificaciones_push, boletin_informativo }) => {
        const result = await pool.query(
            `UPDATE ciudadanos
       SET notificaciones_email = $1, notificaciones_push = $2, boletin_informativo = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING notificaciones_email, notificaciones_push, boletin_informativo`,
            [notificaciones_email, notificaciones_push, boletin_informativo, id]
        );
        return result.rows[0];
    },

    updatePassword: async (id, newHash, table = 'ciudadanos') => {
        await pool.query(
            `UPDATE ${table} SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
            [newHash, id]
        );
    },

    getPasswordHash: async (id, table = 'ciudadanos') => {
        const result = await pool.query(`SELECT password_hash FROM ${table} WHERE id = $1`, [id]);
        return result.rows[0]?.password_hash;
    },

    delete: async (id) => {
        const result = await pool.query('DELETE FROM ciudadanos WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    },

    getAll: async (limit = 100) => {
        const result = await pool.query(`SELECT id, nombre_completo, email, telefono, ciudad, distrito, fecha_registro FROM ciudadanos ORDER BY fecha_registro DESC LIMIT ${limit}`);
        return result.rows;
    }
};
