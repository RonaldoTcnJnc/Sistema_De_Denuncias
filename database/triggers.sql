-- ============================================================================
-- TRIGGERS Y FUNCIONES AUTOMATIZADAS
-- ============================================================================

-- 1. TRIGGER: REGISTRO HISTÓRICO DE CAMBIOS DE ESTADO
CREATE OR REPLACE FUNCTION trg_func_denuncia_estado_log()
RETURNS TRIGGER AS $$
DECLARE
    v_autoridad_nombre VARCHAR;
BEGIN
    IF OLD.estado IS DISTINCT FROM NEW.estado THEN
        -- Intentar determinar quién hizo el cambio (esto es limitado en disparadores puros sin contexto de sesión)
        -- En una implementación real se usarían variables de sesión o se pasaría el usuario en la actualización.
        -- Por defecto, pondremos 'Sistema/Automático' si no se especifica.
        
        INSERT INTO historial_estado_denuncia (denuncia_id, estado_anterior, estado_nuevo, motivo, cambiado_por, fecha_cambio)
        VALUES (NEW.id, OLD.estado, NEW.estado, 'Actualización de estado', 'Sistema/Autoridad', NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_denuncia_estado_log ON denuncias;
CREATE TRIGGER trg_denuncia_estado_log
    AFTER UPDATE ON denuncias
    FOR EACH ROW
    EXECUTE FUNCTION trg_func_denuncia_estado_log();


-- 2. TRIGGER: NOTIFICACIÓN AUTOMÁTICA AL CIUDADANO
CREATE OR REPLACE FUNCTION trg_func_denuncia_estado_notificacion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado IS DISTINCT FROM NEW.estado THEN
        INSERT INTO notificaciones_ciudadano (ciudadano_id, denuncia_id, tipo_notificacion, mensaje, leida, fecha_notificacion)
        VALUES (
            NEW.ciudadano_id, 
            NEW.id, 
            'estado_cambio', 
            'Tu denuncia "' || NEW.titulo || '" ha cambiado de estado a: ' || NEW.estado, 
            FALSE, 
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_denuncia_estado_notificacion ON denuncias;
CREATE TRIGGER trg_denuncia_estado_notificacion
    AFTER UPDATE ON denuncias
    FOR EACH ROW
    EXECUTE FUNCTION trg_func_denuncia_estado_notificacion();


-- 3. TRIGGER: FECHA DE RESOLUCIÓN AUTOMÁTICA
CREATE OR REPLACE FUNCTION trg_func_denuncia_resolucion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'Resuelta' AND OLD.estado != 'Resuelta' THEN
        NEW.fecha_resolucion = NOW();
    ELSIF NEW.estado != 'Resuelta' THEN
        NEW.fecha_resolucion = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_denuncia_resolucion ON denuncias;
CREATE TRIGGER trg_denuncia_resolucion
    BEFORE UPDATE ON denuncias
    FOR EACH ROW
    EXECUTE FUNCTION trg_func_denuncia_resolucion();
