
import pool from '../config/db.js';

const migration = async () => {
    try {
        console.log('Iniciando migración de antecedentes vehiculares...');

        // 1. Create table antecedentes_vehiculares
        await pool.query(`
            CREATE TABLE IF NOT EXISTS antecedentes_vehiculares (
                id SERIAL PRIMARY KEY,
                placa VARCHAR(20) UNIQUE NOT NULL,
                marca VARCHAR(50),
                modelo VARCHAR(50),
                color VARCHAR(30),
                estado VARCHAR(50), -- Robado, Con Captura, Limpio
                descripcion TEXT,
                fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabla antecedentes_vehiculares creada/verificada.');

        // 2. Add column to denuncias if not exists
        try {
            await pool.query(`ALTER TABLE denuncias ADD COLUMN placa_vehiculo VARCHAR(20);`);
            console.log('Columna placa_vehiculo agregada a denuncias.');
        } catch (err) {
            // Ignore if column already exists (code 42701)
            if (err.code === '42701') {
                console.log('Columna placa_vehiculo ya existe en denuncias.');
            } else {
                throw err;
            }
        }

        // 3. Update sp_denuncia_create
        await pool.query(`
            CREATE OR REPLACE FUNCTION sp_denuncia_create(
                p_ciudadano_id INTEGER,
                p_titulo VARCHAR,
                p_descripcion TEXT,
                p_categoria VARCHAR,
                p_ubicacion VARCHAR,
                p_latitud DECIMAL,
                p_longitud DECIMAL,
                p_distrito VARCHAR,
                p_prioridad VARCHAR,
                p_fotografia BYTEA,
                p_placa VARCHAR -- NEW: License plate
            )
            RETURNS SETOF denuncias AS $$
            BEGIN
                RETURN QUERY 
                INSERT INTO denuncias (
                    ciudadano_id, titulo, descripcion, categoria, ubicacion, 
                    latitud, longitud, distrito, prioridad, fotografia, placa_vehiculo,
                    estado, fecha_reporte
                ) VALUES (
                    p_ciudadano_id, p_titulo, p_descripcion, p_categoria, p_ubicacion, 
                    p_latitud, p_longitud, p_distrito, p_prioridad, p_fotografia, p_placa,
                    'Pendiente', CURRENT_TIMESTAMP
                )
                RETURNING *;
            END;
            $$ LANGUAGE plpgsql;
        `);
        console.log('SP sp_denuncia_create actualizado.');

        // 4. Update sp_denuncia_check_plate
        await pool.query(`
            CREATE OR REPLACE FUNCTION sp_denuncia_check_plate(p_plate VARCHAR)
            RETURNS INTEGER AS $$
            BEGIN
                DECLARE
                    v_count INTEGER;
                BEGIN
                    -- Count matches in antecedentes_vehiculares (stolen/captured)
                    SELECT COUNT(*) INTO v_count 
                    FROM antecedentes_vehiculares 
                    WHERE placa = p_plate AND estado IN ('Robado', 'Con Captura');
                    
                    RETURN v_count;
                END;
            END;
            $$ LANGUAGE plpgsql;
        `);
        console.log('SP sp_denuncia_check_plate actualizado.');

        // 5. Insert mock data (using ON CONFLICT DO NOTHING to avoid dupes)
        await pool.query(`
            INSERT INTO antecedentes_vehiculares (placa, marca, modelo, color, estado, descripcion, fecha_reporte) 
            VALUES 
            ('ABC-123', 'Toyota', 'Yaris', 'Gris', 'Robado', 'Vehículo reportado como robado en el distrito Norte', NOW() - INTERVAL '5 days'),
            ('XYZ-987', 'Nissan', 'Sentra', 'Negro', 'Con Captura', 'Orden de captura por participación en ilícito', NOW() - INTERVAL '10 days'),
            ('MNO-456', 'Kia', 'Rio', 'Rojo', 'Limpio', 'Sin novedades', NOW() - INTERVAL '1 month')
            ON CONFLICT (placa) DO NOTHING;
        `);
        console.log('Datos de prueba insertados.');

        console.log('Migración completada exitosamente.');
        process.exit(0);
    } catch (err) {
        console.error('Error durante la migración:', err);
        process.exit(1);
    }
};

migration();
