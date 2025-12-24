import pool from '../config/db.js';

export const Denuncia = {
    findAll: async (limit = 100) => {
        const result = await pool.query('SELECT id, ciudadano_id, titulo, descripcion, categoria, ubicacion, distrito, estado, fecha_reporte, prioridad FROM denuncias ORDER BY fecha_reporte DESC LIMIT $1', [limit]);
        return result.rows;
    },

    findByCitizenId: async (id) => {
        const result = await pool.query(
            'SELECT id, ciudadano_id, titulo, descripcion, categoria, ubicacion, distrito, estado, fecha_reporte, prioridad, fecha_resolucion FROM denuncias WHERE ciudadano_id = $1 ORDER BY fecha_reporte DESC',
            [id]
        );
        return result.rows;
    },

    create: async (data) => {
        const { ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, prioridad } = data;
        const q = `INSERT INTO denuncias (ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, prioridad) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
        const values = [ciudadano_id || null, titulo, descripcion, categoria, ubicacion, latitud || null, longitud || null, distrito || null, prioridad || 'Media'];

        const result = await pool.query(q, values);
        return result.rows[0];
    },

    updateStatus: async (id, { estado, prioridad }) => {
        const result = await pool.query(
            `UPDATE denuncias 
       SET estado = $1, prioridad = $2
       WHERE id = $3
       RETURNING *`,
            [estado, prioridad, id]
        );
        return result.rows[0];
    },

    assign: async ({ denuncia_id, autoridad_id, notas_internas }) => {
        const q = `INSERT INTO asignacion_denuncia (denuncia_id, autoridad_id, notas_internas) VALUES ($1,$2,$3) RETURNING *`;
        const result = await pool.query(q, [denuncia_id, autoridad_id, notas_internas || null]);
        return result.rows[0];
    }
};
