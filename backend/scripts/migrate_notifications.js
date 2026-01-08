
import pool from '../config/db.js';

const migration = async () => {
    try {
        console.log('Migrando procedimientos almacenados de notificaciones...');

        // 1. sp_notificacion_get_by_citizen
        await pool.query(`
            CREATE OR REPLACE FUNCTION sp_notificacion_get_by_citizen(p_citizen_id INTEGER)
            RETURNS TABLE (
                id INTEGER,
                tipo_notificacion VARCHAR,
                mensaje TEXT,
                leida BOOLEAN,
                fecha_notificacion TIMESTAMP,
                denuncia_id INTEGER
            ) AS $$
            BEGIN
                RETURN QUERY 
                SELECT n.id, n.tipo_notificacion, n.mensaje, n.leida, n.fecha_notificacion, n.denuncia_id
                FROM notificaciones_ciudadano n
                WHERE n.ciudadano_id = p_citizen_id
                ORDER BY n.fecha_notificacion DESC
                LIMIT 20;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 2. sp_notificacion_mark_read
        await pool.query(`
            CREATE OR REPLACE FUNCTION sp_notificacion_mark_read(p_id INTEGER)
            RETURNS BOOLEAN AS $$
            BEGIN
                UPDATE notificaciones_ciudadano
                SET leida = TRUE, fecha_lectura = CURRENT_TIMESTAMP
                WHERE id = p_id;
                RETURN FOUND;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 3. sp_notificacion_mark_all_read
        await pool.query(`
            CREATE OR REPLACE FUNCTION sp_notificacion_mark_all_read(p_citizen_id INTEGER)
            RETURNS BOOLEAN AS $$
            BEGIN
                UPDATE notificaciones_ciudadano
                SET leida = TRUE, fecha_lectura = CURRENT_TIMESTAMP
                WHERE ciudadano_id = p_citizen_id AND leida = FALSE;
                RETURN TRUE;
            END;
            $$ LANGUAGE plpgsql;
        `);

        console.log('Migración de notificaciones completada.');
        process.exit(0);
    } catch (err) {
        console.error('Error en migración:', err);
        process.exit(1);
    }
};

migration();
