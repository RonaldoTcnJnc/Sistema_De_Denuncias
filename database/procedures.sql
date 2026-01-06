-- ============================================================================
-- PROCEDIMIENTOS ALMACENADOS PARA EL SISTEMA DE DENUNCIAS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- USUARIOS (CIUDADANOS Y AUTORIDADES)
-- ----------------------------------------------------------------------------

-- Obtener usuario por email (Dinámico para ciudadanos o autoridades)
CREATE OR REPLACE FUNCTION sp_usuario_find_by_email(p_email VARCHAR, p_tabla VARCHAR)
RETURNS SETOF RECORD
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY EXECUTE format('SELECT * FROM %I WHERE email = $1', p_tabla) USING p_email;
END;
$$;

-- Obtener ciudadano por DNI
CREATE OR REPLACE FUNCTION sp_ciudadano_find_by_dni(p_dni VARCHAR)
RETURNS SETOF ciudadanos
LANGUAGE sql
AS $$
    SELECT * FROM ciudadanos WHERE dni = p_dni;
$$;

-- Crear ciudadano
CREATE OR REPLACE FUNCTION sp_ciudadano_create(
    p_nombre VARCHAR, p_email VARCHAR, p_dni VARCHAR, p_telefono VARCHAR, 
    p_direccion VARCHAR, p_ciudad VARCHAR, p_distrito VARCHAR, p_password VARCHAR
)
RETURNS TABLE (id INTEGER, nombre_completo VARCHAR, email VARCHAR, dni VARCHAR, telefono VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO ciudadanos (nombre_completo, email, dni, telefono, direccion, ciudad, distrito, password_hash)
    VALUES (p_nombre, p_email, p_dni, p_telefono, p_direccion, p_ciudad, p_distrito, p_password)
    RETURNING ciudadanos.id, ciudadanos.nombre_completo, ciudadanos.email, ciudadanos.dni, ciudadanos.telefono;
END;
$$;

-- Obtener usuario por ID (Dinámico para ciudadanos o autoridades)
CREATE OR REPLACE FUNCTION sp_usuario_find_by_id(p_id INTEGER, p_tabla VARCHAR)
RETURNS SETOF RECORD
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_tabla = 'ciudadanos' THEN
        RETURN QUERY EXECUTE 
        'SELECT id, nombre_completo, email, telefono, direccion, ciudad, distrito, fecha_registro, verificado, fotografia_perfil, notificaciones_email, notificaciones_push, boletin_informativo, NULL::varchar as departamento, NULL::varchar as cargo, NULL::varchar as rol, NULL::varchar as distrito_asignado FROM ciudadanos WHERE id = $1' 
        USING p_id;
    ELSE
        RETURN QUERY EXECUTE 
        'SELECT id, nombre_completo, email, telefono, NULL::text as direccion, NULL::varchar as ciudad, NULL::varchar as distrito, NULL::timestamp as fecha_registro, NULL::boolean as verificado, NULL::bytea as fotografia_perfil, NULL::boolean as notificaciones_email, NULL::boolean as notificaciones_push, NULL::boolean as boletin_informativo, departamento, cargo, rol, distrito_asignado FROM autoridades WHERE id = $1' 
        USING p_id;
    END IF;
END;
$$;

-- Actualizar ciudadano
CREATE OR REPLACE FUNCTION sp_ciudadano_update(
    p_id INTEGER, p_nombre VARCHAR, p_telefono VARCHAR, p_direccion VARCHAR, 
    p_ciudad VARCHAR, p_distrito VARCHAR, p_fotografia BYTEA
)
RETURNS TABLE (id INTEGER, nombre_completo VARCHAR, email VARCHAR, telefono VARCHAR, direccion VARCHAR, ciudad VARCHAR, distrito VARCHAR, fecha_registro TIMESTAMP, verificado BOOLEAN)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_fotografia IS NOT NULL THEN
        RETURN QUERY
        UPDATE ciudadanos
        SET nombre_completo = p_nombre, telefono = p_telefono, direccion = p_direccion, 
            ciudad = p_ciudad, distrito = p_distrito, fotografia_perfil = p_fotografia, updated_at = NOW()
        WHERE ciudadanos.id = p_id
        RETURNING ciudadanos.id, ciudadanos.nombre_completo, ciudadanos.email, ciudadanos.telefono, ciudadanos.direccion, ciudadanos.ciudad, ciudadanos.distrito, ciudadanos.fecha_registro, ciudadanos.verificado;
    ELSE
        RETURN QUERY
        UPDATE ciudadanos
        SET nombre_completo = p_nombre, telefono = p_telefono, direccion = p_direccion, 
            ciudad = p_ciudad, distrito = p_distrito, updated_at = NOW()
        WHERE ciudadanos.id = p_id
        RETURNING ciudadanos.id, ciudadanos.nombre_completo, ciudadanos.email, ciudadanos.telefono, ciudadanos.direccion, ciudadanos.ciudad, ciudadanos.distrito, ciudadanos.fecha_registro, ciudadanos.verificado;
    END IF;
END;
$$;

-- Actualizar preferencias
CREATE OR REPLACE FUNCTION sp_ciudadano_update_preferences(
    p_id INTEGER, p_email_notif BOOLEAN, p_push_notif BOOLEAN, p_boletin BOOLEAN
)
RETURNS TABLE (notificaciones_email BOOLEAN, notificaciones_push BOOLEAN, boletin_informativo BOOLEAN)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE ciudadanos
    SET notificaciones_email = p_email_notif, notificaciones_push = p_push_notif, 
        boletin_informativo = p_boletin, updated_at = NOW()
    WHERE ciudadanos.id = p_id
    RETURNING ciudadanos.notificaciones_email, ciudadanos.notificaciones_push, ciudadanos.boletin_informativo;
END;
$$;

-- Actualizar contraseña (Dinámico)
CREATE OR REPLACE FUNCTION sp_usuario_update_password(p_id INTEGER, p_password VARCHAR, p_tabla VARCHAR)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    EXECUTE format('UPDATE %I SET password_hash = $1, updated_at = NOW() WHERE id = $2', p_tabla) 
    USING p_password, p_id;
END;
$$;

-- Obtener hash contraseña (Dinámico)
CREATE OR REPLACE FUNCTION sp_usuario_get_password_hash(p_id INTEGER, p_tabla VARCHAR)
RETURNS TABLE (password_hash VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY EXECUTE format('SELECT password_hash FROM %I WHERE id = $1', p_tabla) USING p_id;
END;
$$;

-- Eliminar ciudadano
CREATE OR REPLACE FUNCTION sp_ciudadano_delete(p_id INTEGER)
RETURNS TABLE (id INTEGER)
LANGUAGE sql
AS $$
    DELETE FROM ciudadanos WHERE id = p_id RETURNING id;
$$;

-- Listar ciudadanos
CREATE OR REPLACE FUNCTION sp_ciudadano_get_all(p_limit INTEGER)
RETURNS TABLE (id INTEGER, nombre_completo VARCHAR, email VARCHAR, telefono VARCHAR, ciudad VARCHAR, distrito VARCHAR, fecha_registro TIMESTAMP)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.nombre_completo, c.email, c.telefono, c.ciudad, c.distrito, c.fecha_registro 
    FROM ciudadanos c
    ORDER BY c.fecha_registro DESC 
    LIMIT p_limit;
END;
$$;

-- Listar autoridades
CREATE OR REPLACE FUNCTION sp_autoridad_get_all()
RETURNS TABLE (id INTEGER, nombre_completo VARCHAR, email VARCHAR, departamento VARCHAR, cargo VARCHAR, rol VARCHAR, distrito_asignado VARCHAR)
LANGUAGE sql
AS $$
    SELECT id, nombre_completo, email, departamento, cargo, rol, distrito_asignado 
    FROM autoridades 
    ORDER BY nombre_completo;
$$;


-- ----------------------------------------------------------------------------
-- DENUNCIAS
-- ----------------------------------------------------------------------------

-- Listar todas las denuncias
CREATE OR REPLACE FUNCTION sp_denuncia_get_all(p_limit INTEGER)
RETURNS TABLE (
    id INTEGER, ciudadano_id INTEGER, titulo VARCHAR, descripcion TEXT, categoria VARCHAR, 
    ubicacion VARCHAR, latitud DECIMAL, longitud DECIMAL, distrito VARCHAR, fotografia BYTEA,
    estado VARCHAR, fecha_reporte TIMESTAMP, fecha_resolucion TIMESTAMP, comentarios_ciudadano TEXT,
    prioridad VARCHAR, visible_publicamente BOOLEAN, created_at TIMESTAMP, updated_at TIMESTAMP,
    ciudadano_nombre VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT d.*, c.nombre_completo as ciudadano_nombre 
    FROM denuncias d 
    LEFT JOIN ciudadanos c ON d.ciudadano_id = c.id 
    ORDER BY d.fecha_reporte DESC 
    LIMIT p_limit;
END;
$$;

-- Buscar denuncias por ciudadano
CREATE OR REPLACE FUNCTION sp_denuncia_find_by_citizen(p_id INTEGER)
RETURNS TABLE (
    id INTEGER, ciudadano_id INTEGER, titulo VARCHAR, descripcion TEXT, categoria VARCHAR, 
    ubicacion VARCHAR, distrito VARCHAR, estado VARCHAR, fecha_reporte TIMESTAMP, 
    prioridad VARCHAR, fecha_resolucion TIMESTAMP
)
LANGUAGE sql
AS $$
    SELECT id, ciudadano_id, titulo, descripcion, categoria, ubicacion, distrito, estado, fecha_reporte, prioridad, fecha_resolucion 
    FROM denuncias 
    WHERE ciudadano_id = p_id 
    ORDER BY fecha_reporte DESC;
$$;

-- Buscar denuncia por ID
CREATE OR REPLACE FUNCTION sp_denuncia_find_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER, titulo VARCHAR, descripcion TEXT, categoria VARCHAR, ubicacion VARCHAR, 
    distrito VARCHAR, estado VARCHAR, fecha_reporte TIMESTAMP, fecha_resolucion TIMESTAMP, prioridad VARCHAR
)
LANGUAGE sql
AS $$
    SELECT id, titulo, descripcion, categoria, ubicacion, distrito, estado, fecha_reporte, fecha_resolucion, prioridad 
    FROM denuncias 
    WHERE id = p_id;
$$;

-- Crear denuncia
CREATE OR REPLACE FUNCTION sp_denuncia_create(
    p_ciudadano_id INTEGER, p_titulo VARCHAR, p_descripcion TEXT, p_categoria VARCHAR,
    p_ubicacion VARCHAR, p_latitud DECIMAL, p_longitud DECIMAL, p_distrito VARCHAR,
    p_prioridad VARCHAR, p_fotografia BYTEA, p_placa_vehiculo VARCHAR
)
RETURNS SETOF denuncias
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO denuncias (
        ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, 
        distrito, prioridad, fotografia, placa_vehiculo
    ) 
    VALUES (
        p_ciudadano_id, p_titulo, p_descripcion, p_categoria, p_ubicacion, p_latitud, p_longitud, 
        p_distrito, COALESCE(p_prioridad, 'Media'), p_fotografia, p_placa_vehiculo
    ) 
    RETURNING *;
END;
$$;

-- Actualizar estado denuncia
CREATE OR REPLACE FUNCTION sp_denuncia_update_status(p_id INTEGER, p_estado VARCHAR, p_prioridad VARCHAR)
RETURNS SETOF denuncias
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE denuncias 
    SET estado = p_estado, prioridad = p_prioridad, updated_at = NOW()
    WHERE id = p_id
    RETURNING *;
END;
$$;

-- Asignar denuncia
CREATE OR REPLACE FUNCTION sp_denuncia_assign(p_denuncia_id INTEGER, p_autoridad_id INTEGER, p_notas TEXT)
RETURNS SETOF asignacion_denuncia
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO asignacion_denuncia (denuncia_id, autoridad_id, notas_internas) 
    VALUES (p_denuncia_id, p_autoridad_id, p_notas) 
    RETURNING *;
END;
$$;

-- Agregar actualización de autoridad
CREATE OR REPLACE FUNCTION sp_denuncia_add_authority_update(
    p_denuncia_id INTEGER, p_autoridad_id INTEGER, p_tipo VARCHAR, 
    p_descripcion TEXT, p_evidencia BYTEA, p_visible BOOLEAN
)
RETURNS SETOF actualizaciones_autoridad
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO actualizaciones_autoridad (
        denuncia_id, autoridad_id, tipo_actualizacion, descripcion, 
        fotografia_evidencia, visible_para_ciudadano
    ) 
    VALUES (
        p_denuncia_id, p_autoridad_id, p_tipo, p_descripcion, 
        p_evidencia, COALESCE(p_visible, FALSE)
    ) 
    RETURNING *;
END;
$$;

-- Verificar placa
CREATE OR REPLACE FUNCTION sp_denuncia_check_plate(p_plate VARCHAR)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count 
    FROM denuncias 
    WHERE UPPER(placa_vehiculo) = UPPER(p_plate);
    
    RETURN v_count;
END;
$$;

-- Estadísticas: Totales
CREATE OR REPLACE FUNCTION sp_denuncia_stats_total()
RETURNS INTEGER
LANGUAGE sql
AS $$
    SELECT COUNT(*)::INTEGER FROM denuncias;
$$;

-- Estadísticas: Por Estado
CREATE OR REPLACE FUNCTION sp_denuncia_stats_status()
RETURNS TABLE (estado VARCHAR, count BIGINT)
LANGUAGE sql
AS $$
    SELECT estado, COUNT(*) FROM denuncias GROUP BY estado;
$$;

-- Estadísticas: Por Categoría
CREATE OR REPLACE FUNCTION sp_denuncia_stats_category()
RETURNS TABLE (categoria VARCHAR, count BIGINT)
LANGUAGE sql
AS $$
    SELECT categoria, COUNT(*) FROM denuncias GROUP BY categoria;
$$;

-- Estadísticas: Mensual
CREATE OR REPLACE FUNCTION sp_denuncia_stats_monthly()
RETURNS TABLE (mes TEXT, count BIGINT)
LANGUAGE sql
AS $$
    SELECT 
        to_char(fecha_reporte, 'YYYY-MM') as mes, 
        COUNT(*) 
    FROM denuncias 
    WHERE fecha_reporte >= NOW() - INTERVAL '1 year' 
    GROUP BY mes 
    ORDER BY mes;
$$;
