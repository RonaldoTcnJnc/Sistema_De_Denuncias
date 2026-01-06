import pool from '../config/db.js';

export const Denuncia = {
    findAll: async (limit = 100) => {
        const result = await pool.query(`
            SELECT d.*, c.nombre_completo as ciudadano_nombre 
            FROM denuncias d 
            LEFT JOIN ciudadanos c ON d.ciudadano_id = c.id 
            ORDER BY d.fecha_reporte DESC 
            LIMIT $1
        `, [limit]);
        return result.rows;
    },

    query: async (text, params) => {
        return pool.query(text, params);
    },

    findByCitizenId: async (id) => {
        const result = await pool.query(
            'SELECT id, ciudadano_id, titulo, descripcion, categoria, ubicacion, distrito, estado, fecha_reporte, prioridad, fecha_resolucion FROM denuncias WHERE ciudadano_id = $1 ORDER BY fecha_reporte DESC',
            [id]
        );
        return result.rows;
    },

    findById: async (id) => {
        const result = await pool.query(
            'SELECT id, titulo, descripcion, categoria, ubicacion, distrito, estado, fecha_reporte, fecha_resolucion, prioridad FROM denuncias WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    create: async (data) => {
        const { ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, prioridad, fotografia, placa_vehiculo } = data;
        const q = `INSERT INTO denuncias (ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, prioridad, fotografia, placa_vehiculo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;
        const values = [ciudadano_id || null, titulo, descripcion, categoria, ubicacion, latitud || null, longitud || null, distrito || null, prioridad || 'Media', fotografia || null, placa_vehiculo || null];

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
    },

    addAuthorityUpdate: async ({ denuncia_id, autoridad_id, tipo_actualizacion, descripcion, fotografia_evidencia, visible_para_ciudadano }) => {
        const q = `INSERT INTO actualizaciones_autoridad (denuncia_id, autoridad_id, tipo_actualizacion, descripcion, fotografia_evidencia, visible_para_ciudadano) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
        const result = await pool.query(q, [denuncia_id, autoridad_id, tipo_actualizacion, descripcion, fotografia_evidencia || null, visible_para_ciudadano || false]);
        return result.rows[0];
    },

    checkPlate: async (plate) => {
        const result = await pool.query(`SELECT COUNT(*) FROM denuncias WHERE UPPER(placa_vehiculo) = UPPER($1)`, [plate]);
        return parseInt(result.rows[0].count);
    },

    getEstadisticas: async () => {
        // Total count
        const total = await pool.query('SELECT COUNT(*) FROM denuncias');

        // Status counts
        const status = await pool.query('SELECT estado, COUNT(*) FROM denuncias GROUP BY estado');

        // Category counts
        const category = await pool.query('SELECT categoria, COUNT(*) FROM denuncias GROUP BY categoria');

        // Monthly counts (last 12 months) based on fecha_reporte
        const monthly = await pool.query(`
            SELECT 
                to_char(fecha_reporte, 'YYYY-MM') as mes, 
                COUNT(*) 
            FROM denuncias 
            WHERE fecha_reporte >= NOW() - INTERVAL '1 year' 
            GROUP BY mes 
            ORDER BY mes
        `);

        return {
            total: parseInt(total.rows[0].count),
            byStatus: status.rows,
            byCategory: category.rows,
            byMonth: monthly.rows
        };
    }
};
