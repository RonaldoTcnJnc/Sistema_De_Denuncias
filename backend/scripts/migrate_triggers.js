
import pool from '../config/db.js';

const migration = async () => {
    try {
        console.log('Creando trigger de notificaciones...');

        // Function
        await pool.query(`
            CREATE OR REPLACE FUNCTION sp_trigger_notify_status_change()
            RETURNS TRIGGER AS $$
            BEGIN
                IF OLD.estado IS DISTINCT FROM NEW.estado THEN
                    INSERT INTO notificaciones_ciudadano (ciudadano_id, tipo_notificacion, mensaje, denuncia_id)
                    VALUES (
                        NEW.ciudadano_id,
                        'estado_cambio',
                        'El estado de tu denuncia "' || NEW.titulo || '" ha cambiado a ' || NEW.estado || '.',
                        NEW.id
                    );
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Trigger
        await pool.query(`
            DROP TRIGGER IF EXISTS trg_notify_status_change ON denuncias;
            CREATE TRIGGER trg_notify_status_change
            AFTER UPDATE OF estado ON denuncias
            FOR EACH ROW
            EXECUTE FUNCTION sp_trigger_notify_status_change();
        `);

        console.log('Trigger de notificaciones creado.');
        process.exit(0);
    } catch (err) {
        console.error('Error creando trigger:', err);
        process.exit(1);
    }
};

migration();
