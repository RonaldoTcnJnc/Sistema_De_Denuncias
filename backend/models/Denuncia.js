import pool from '../config/db.js';

export const Denuncia = {
    findAll: async (limit = 100) => {
        const result = await pool.query('SELECT * FROM sp_denuncia_get_all($1)', [limit]);
        return result.rows;
    },

    query: async (text, params) => {
        return pool.query(text, params);
    },

    findByCitizenId: async (id) => {
        const result = await pool.query('SELECT * FROM sp_denuncia_find_by_citizen($1)', [id]);
        return result.rows;
    },

    findById: async (id) => {
        const result = await pool.query('SELECT * FROM sp_denuncia_find_by_id($1)', [id]);
        return result.rows[0];
    },

    create: async (data) => {
        const { ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, prioridad, fotografia, placa_vehiculo } = data;

        const result = await pool.query(
            'SELECT * FROM sp_denuncia_create($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [ciudadano_id || null, titulo, descripcion, categoria, ubicacion, latitud || null, longitud || null, distrito || null, prioridad || 'Media', fotografia || null, placa_vehiculo || null]
        );
        return result.rows[0];
    },

    updateStatus: async (id, { estado, prioridad }) => {
        const result = await pool.query(
            'SELECT * FROM sp_denuncia_update_status($1, $2, $3)',
            [id, estado, prioridad]
        );
        return result.rows[0];
    },

    assign: async ({ denuncia_id, autoridad_id, notas_internas }) => {
        const result = await pool.query(
            'SELECT * FROM sp_denuncia_assign($1, $2, $3)',
            [denuncia_id, autoridad_id, notas_internas || null]
        );
        return result.rows[0];
    },

    addAuthorityUpdate: async ({ denuncia_id, autoridad_id, tipo_actualizacion, descripcion, fotografia_evidencia, mime_type, visible_para_ciudadano }) => {
        const result = await pool.query(
            'SELECT * FROM sp_denuncia_add_authority_update($1, $2, $3, $4, $5, $6, $7)',
            [denuncia_id, autoridad_id, tipo_actualizacion, descripcion, fotografia_evidencia || null, visible_para_ciudadano || false, mime_type || 'image/jpeg']
        );
        return result.rows[0];
    },

    checkPlate: async (plate) => {
        const result = await pool.query('SELECT sp_denuncia_check_plate($1) as count', [plate]);
        return parseInt(result.rows[0].count);
    },

    getEstadisticas: async () => {
        // Ejecutar múltiples consultas o procedimientos
        // En este caso llamamos a SPs individuales
        const total = await pool.query('SELECT sp_denuncia_stats_total() as count');
        const status = await pool.query('SELECT * FROM sp_denuncia_stats_status()');
        const category = await pool.query('SELECT * FROM sp_denuncia_stats_category()');
        const monthly = await pool.query('SELECT * FROM sp_denuncia_stats_monthly()');

        return {
            total: parseInt(total.rows[0].count),
            byStatus: status.rows,
            byCategory: category.rows,
            byMonth: monthly.rows
        };
    }
};
