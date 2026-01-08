
import pool from '../config/db.js';

const migration = async () => {
    try {
        console.log('Actualizando lógica de verificación de placas...');

        await pool.query(`
            CREATE OR REPLACE FUNCTION sp_denuncia_check_plate(p_plate VARCHAR)
            RETURNS INTEGER AS $$
            BEGIN
                DECLARE
                    v_count INTEGER;
                    v_denuncias_count INTEGER;
                BEGIN
                    -- Count matches in antecedentes_vehiculares (stolen/captured)
                    SELECT COUNT(*) INTO v_count 
                    FROM antecedentes_vehiculares 
                    WHERE placa = p_plate AND estado IN ('Robado', 'Con Captura');
                    
                    -- Count matches in denuncias (active reports only)
                    SELECT COUNT(*) INTO v_denuncias_count
                    FROM denuncias
                    WHERE placa_vehiculo = p_plate AND estado IN ('Pendiente', 'En Progreso');
                    
                    RETURN v_count + v_denuncias_count;
                END;
            END;
            $$ LANGUAGE plpgsql;
        `);
        console.log('SP sp_denuncia_check_plate actualizado correctamente.');
        process.exit(0);
    } catch (err) {
        console.error('Error durante la migración:', err);
        process.exit(1);
    }
};

migration();
