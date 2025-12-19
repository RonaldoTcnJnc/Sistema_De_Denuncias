-- ============================================================================
-- GUÍA DE CONFIGURACIÓN Y QUERIES ÚTILES
-- SISTEMA DE DENUNCIAS CIUDADANAS - PostgreSQL
-- ============================================================================

-- ============================================================================
-- 1. INSTRUCCIONES INICIALES DE SETUP
-- ============================================================================

/*
PASO 1: Crear la base de datos
Execute en tu cliente PostgreSQL:

CREATE DATABASE sistema_denuncias
  WITH
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_ES.UTF-8'
  LC_CTYPE = 'es_ES.UTF-8';

PASO 2: Conectarse a la base de datos
\c sistema_denuncias

PASO 3: Ejecutar el archivo schema.sql
\i 'ruta/a/schema.sql'

PASO 4: Ejecutar el archivo seed_data.sql (datos de ejemplo)
\i 'ruta/a/seed_data.sql'

PASO 5: Verificar que todo está correcto
SELECT COUNT(*) FROM ciudadanos;
SELECT COUNT(*) FROM denuncias;
SELECT COUNT(*) FROM autoridades;
*/

-- ============================================================================
-- 2. QUERIES ÚTILES PARA DASHBOARDS
-- ============================================================================

-- 2.1 DASHBOARD DE CIUDADANOS
-- Obtener resumen de denuncias del ciudadano

SELECT 
    d.id,
    d.titulo,
    d.estado,
    d.categoria,
    d.fecha_reporte,
    d.prioridad,
    (SELECT COUNT(*) FROM comentarios_denuncia WHERE denuncia_id = d.id) as total_comentarios,
    (SELECT AVG(calificacion) FROM calificaciones_denuncia WHERE denuncia_id = d.id) as calificacion_promedio
FROM denuncias d
WHERE d.ciudadano_id = $1
ORDER BY d.fecha_reporte DESC;

-- 2.2 OBTENER NOTIFICACIONES DEL CIUDADANO

SELECT 
    id,
    tipo_notificacion,
    mensaje,
    fecha_notificacion,
    leida,
    denuncia_id
FROM notificaciones_ciudadano
WHERE ciudadano_id = $1 AND leida = FALSE
ORDER BY fecha_notificacion DESC
LIMIT 20;

-- 2.3 ESTADÍSTICAS PERSONALES DEL CIUDADANO

SELECT 
    COUNT(*) as total_denuncias,
    SUM(CASE WHEN estado = 'Resuelta' THEN 1 ELSE 0 END) as resueltas,
    SUM(CASE WHEN estado = 'Pendiente' THEN 1 ELSE 0 END) as pendientes,
    SUM(CASE WHEN estado = 'En Progreso' THEN 1 ELSE 0 END) as en_progreso,
    AVG(CASE WHEN estado = 'Resuelta' THEN EXTRACT(EPOCH FROM (fecha_resolucion - fecha_reporte))/3600 ELSE NULL END) as tiempo_promedio_resolucion_horas
FROM denuncias
WHERE ciudadano_id = $1;

-- ============================================================================
-- 3. QUERIES PARA DASHBOARD DE AUTORIDADES
-- ============================================================================

-- 3.1 DENUNCIAS ASIGNADAS A UNA AUTORIDAD

SELECT 
    d.id,
    d.titulo,
    d.descripcion,
    d.estado,
    d.categoria,
    d.prioridad,
    d.fecha_reporte,
    c.nombre_completo as ciudadano,
    c.email as ciudadano_email,
    (SELECT COUNT(*) FROM actualizaciones_autoridad WHERE denuncia_id = d.id AND autoridad_id = $1) as actualizaciones_realizadas
FROM denuncias d
JOIN asignacion_denuncia a ON d.id = a.denuncia_id
JOIN ciudadanos c ON d.ciudadano_id = c.id
WHERE a.autoridad_id = $1 AND a.estado_asignacion IN ('Pendiente', 'En Proceso')
ORDER BY d.prioridad DESC, d.fecha_reporte ASC;

-- 3.2 ESTADÍSTICAS DEL EQUIPO MUNICIPAL

SELECT 
    em.nombre_equipo,
    COUNT(DISTINCT te.denuncia_id) as total_tareas,
    SUM(CASE WHEN te.estado = 'Completada' THEN 1 ELSE 0 END) as completadas,
    SUM(CASE WHEN te.estado = 'En Ejecución' THEN 1 ELSE 0 END) as en_ejecucion,
    SUM(CASE WHEN te.estado = 'Pendiente' THEN 1 ELSE 0 END) as pendientes
FROM equipos_municipales em
LEFT JOIN tareas_equipo te ON em.id = te.equipo_id
WHERE em.id = $1
GROUP BY em.id, em.nombre_equipo;

-- 3.3 RENDIMIENTO PERSONAL DEL MES

SELECT 
    ra.mes,
    ra.denuncias_asignadas,
    ra.denuncias_completadas,
    ROUND(ra.tiempo_promedio_resolucion_horas, 2) as tiempo_resolucion_horas,
    ROUND(ra.tasa_satisfaccion::numeric, 2) as satisfaccion,
    ra.rating_performance
FROM rendimiento_autoridad ra
WHERE ra.autoridad_id = $1
ORDER BY ra.mes DESC
LIMIT 12;

-- ============================================================================
-- 4. QUERIES DE ANÁLISIS Y REPORTES
-- ============================================================================

-- 4.1 DISTRIBUCIÓN DE DENUNCIAS POR CATEGORÍA (ÚLTIMO MES)

SELECT 
    categoria,
    COUNT(*) as total,
    SUM(CASE WHEN estado = 'Resuelta' THEN 1 ELSE 0 END) as resueltas,
    ROUND(100.0 * SUM(CASE WHEN estado = 'Resuelta' THEN 1 ELSE 0 END) / COUNT(*), 2) as porcentaje_resolucion,
    AVG(EXTRACT(EPOCH FROM (fecha_resolucion - fecha_reporte))/3600)::numeric(10,2) as tiempo_promedio_horas
FROM denuncias
WHERE fecha_reporte >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY categoria
ORDER BY total DESC;

-- 4.2 DENUNCIAS POR DISTRITO CON AUTORIDADES

SELECT 
    d.distrito,
    COUNT(DISTINCT d.id) as total_denuncias,
    COUNT(DISTINCT a.autoridad_id) as autoridades_activas,
    SUM(CASE WHEN d.estado = 'Resuelta' THEN 1 ELSE 0 END) as resueltas,
    ROUND(100.0 * SUM(CASE WHEN d.estado = 'Resuelta' THEN 1 ELSE 0 END) / COUNT(*), 2) as tasa_resolucion
FROM denuncias d
LEFT JOIN asignacion_denuncia a ON d.id = a.denuncia_id
WHERE d.fecha_reporte >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY d.distrito
ORDER BY total_denuncias DESC;

-- 4.3 RANKING DE AUTORIDADES (TOP 10)

SELECT 
    a.nombre_completo,
    a.cargo,
    COUNT(DISTINCT ad.denuncia_id) as denuncias_procesadas,
    SUM(CASE WHEN d.estado = 'Resuelta' THEN 1 ELSE 0 END) as resueltas,
    ROUND(AVG(CASE WHEN d.estado = 'Resuelta' THEN EXTRACT(EPOCH FROM (d.fecha_resolucion - d.fecha_reporte))/3600 ELSE NULL END)::numeric, 2) as tiempo_promedio_horas,
    ROUND(AVG(c.calificacion)::numeric, 2) as calificacion_promedio
FROM autoridades a
LEFT JOIN asignacion_denuncia ad ON a.id = ad.autoridad_id
LEFT JOIN denuncias d ON ad.denuncia_id = d.id
LEFT JOIN calificaciones_denuncia c ON d.id = c.denuncia_id
WHERE a.activo = TRUE
GROUP BY a.id, a.nombre_completo, a.cargo
HAVING COUNT(DISTINCT ad.denuncia_id) > 0
ORDER BY resueltas DESC, tiempo_promedio_horas ASC
LIMIT 10;

-- 4.4 DENUNCIAS URGENTES PENDIENTES

SELECT 
    d.id,
    d.titulo,
    d.descripcion,
    d.prioridad,
    d.categoria,
    d.ubicacion,
    d.fecha_reporte,
    c.nombre_completo as ciudadano,
    c.telefono,
    CURRENT_TIMESTAMP - d.fecha_reporte as tiempo_espera
FROM denuncias d
JOIN ciudadanos c ON d.ciudadano_id = c.id
WHERE d.estado = 'Pendiente' AND d.prioridad IN ('Alta', 'Crítica')
ORDER BY d.prioridad DESC, d.fecha_reporte ASC;

-- 4.5 SATISFACCIÓN GENERAL DE CIUDADANOS (ÚLTIMAS 100 CALIFICACIONES)

SELECT 
    ROUND(AVG(calificacion)::numeric, 2) as calificacion_promedio,
    MIN(calificacion) as calificacion_minima,
    MAX(calificacion) as calificacion_maxima,
    COUNT(*) as total_calificaciones
FROM (
    SELECT calificacion FROM calificaciones_denuncia 
    ORDER BY fecha_calificacion DESC 
    LIMIT 100
) sq;

-- ============================================================================
-- 5. QUERIES DE MANTENIMIENTO Y AUDITORÍA
-- ============================================================================

-- 5.1 REGISTRO DE CAMBIOS RECIENTES

SELECT 
    usuario_tipo,
    accion,
    tabla_afectada,
    fecha_actividad,
    ip_address
FROM registro_actividades
ORDER BY fecha_actividad DESC
LIMIT 100;

-- 5.2 DENUNCIAS SIN ASIGNAR

SELECT 
    d.id,
    d.titulo,
    d.descripcion,
    d.prioridad,
    d.categoria,
    d.fecha_reporte,
    CURRENT_TIMESTAMP - d.fecha_reporte as dias_sin_asignar
FROM denuncias d
WHERE d.id NOT IN (SELECT DISTINCT denuncia_id FROM asignacion_denuncia)
ORDER BY d.prioridad DESC, d.fecha_reporte ASC;

-- 5.3 CIUDADANOS INACTIVOS (SIN DENUNCIAS EN 6 MESES)

SELECT 
    c.id,
    c.nombre_completo,
    c.email,
    MAX(d.fecha_reporte) as ultima_denuncia,
    COUNT(d.id) as total_denuncias
FROM ciudadanos c
LEFT JOIN denuncias d ON c.id = d.ciudadano_id
GROUP BY c.id
HAVING MAX(d.fecha_reporte) < CURRENT_DATE - INTERVAL '6 months' OR MAX(d.fecha_reporte) IS NULL
ORDER BY MAX(d.fecha_reporte) ASC;

-- ============================================================================
-- 6. STORED PROCEDURES RECOMENDADOS
-- ============================================================================

-- Crear función para actualizar estado de denuncia automáticamente

CREATE OR REPLACE FUNCTION actualizar_estado_denuncia(
    p_denuncia_id INTEGER,
    p_nuevo_estado VARCHAR,
    p_autoridad_id INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_estado_anterior VARCHAR;
BEGIN
    -- Obtener estado anterior
    SELECT estado INTO v_estado_anterior FROM denuncias WHERE id = p_denuncia_id;
    
    -- Actualizar denuncias
    UPDATE denuncias 
    SET estado = p_nuevo_estado,
        fecha_resolucion = CASE WHEN p_nuevo_estado = 'Resuelta' THEN CURRENT_TIMESTAMP ELSE NULL END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_denuncia_id;
    
    -- Registrar en historial
    INSERT INTO historial_estado_denuncia (denuncia_id, estado_anterior, estado_nuevo, cambiado_por)
    VALUES (p_denuncia_id, v_estado_anterior, p_nuevo_estado, 
            (SELECT nombre_completo FROM autoridades WHERE id = p_autoridad_id));
    
    -- Notificar al ciudadano
    INSERT INTO notificaciones_ciudadano (ciudadano_id, denuncia_id, tipo_notificacion, mensaje)
    SELECT ciudadano_id, id, 'estado_cambio', 
           'Tu denuncia ha cambiado de estado a: ' || p_nuevo_estado
    FROM denuncias WHERE id = p_denuncia_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. CONSULTAS DE EJEMPLO CON PARÁMETROS
-- ============================================================================

-- Buscar denuncias por rango de fechas y estado

SELECT 
    d.id,
    d.titulo,
    d.estado,
    d.fecha_reporte,
    COUNT(DISTINCT c.id) as comentarios
FROM denuncias d
LEFT JOIN comentarios_denuncia c ON d.id = c.denuncia_id
WHERE d.fecha_reporte BETWEEN $1 AND $2
  AND d.estado = $3
GROUP BY d.id
ORDER BY d.fecha_reporte DESC;

-- Búsqueda avanzada con múltiples filtros

SELECT 
    d.id,
    d.titulo,
    d.categoria,
    d.estado,
    d.prioridad,
    c.nombre_completo,
    d.fecha_reporte
FROM denuncias d
JOIN ciudadanos c ON d.ciudadano_id = c.id
WHERE (d.titulo ILIKE '%' || $1 || '%' OR d.descripcion ILIKE '%' || $1 || '%')
  AND ($2::VARCHAR IS NULL OR d.categoria = $2)
  AND ($3::VARCHAR IS NULL OR d.estado = $3)
  AND ($4::VARCHAR IS NULL OR d.distrito = $4)
  AND d.fecha_reporte >= $5::DATE
ORDER BY d.fecha_reporte DESC
LIMIT $6 OFFSET $7;

-- ============================================================================
-- 8. NOTAS IMPORTANTES
-- ============================================================================

/*
CONSIDERACIONES DE SEGURIDAD:
1. Todas las contraseñas deben estar hasheadas (bcrypt, Argon2, etc.)
2. Implementar control de acceso basado en roles (RBAC)
3. Auditar todas las modificaciones críticas
4. Encriptar datos sensibles en tránsito (HTTPS/TLS)
5. Implementar rate limiting en APIs
6. Validar entrada de datos en el aplicativo

OPTIMIZACIONES:
1. Crear índices adicionales según patrones de consulta
2. Implementar caché para consultas frecuentes
3. Usar particionamiento para tabla de denuncias si es muy grande
4. Crear vistas materialized para reportes complejos

BACKUPS:
pg_dump sistema_denuncias > backup_$(date +%Y%m%d).sql

RESTAURACIÓN:
psql sistema_denuncias < backup_20240101.sql
*/
