-- ============================================================================
-- DATOS DE EJEMPLO PARA BASE DE DATOS DEL SISTEMA DE DENUNCIAS
-- ============================================================================

-- ============================================================================
-- INSERTAR CIUDADANOS DE EJEMPLO
-- ============================================================================

INSERT INTO ciudadanos (nombre_completo, email, telefono, direccion, ciudad, distrito, contraseña_hash, fecha_registro, verificado, notificaciones_email, notificaciones_push, boletin_informativo) 
VALUES 
('Juan Pérez García', 'juan.perez@example.com', '+51 987 654 321', 'Calle Principal 123', 'Cusco', 'Norte', 'hashed_password_123', NOW() - INTERVAL '6 months', TRUE, TRUE, FALSE, TRUE),
('María López Rodríguez', 'maria.lopez@example.com', '+51 987 654 322', 'Avenida Central 456', 'Cusco', 'Sur', 'hashed_password_124', NOW() - INTERVAL '4 months', TRUE, TRUE, TRUE, TRUE),
('Carlos Mendez Torres', 'carlos.mendez@example.com', '+51 987 654 323', 'Calle Secundaria 789', 'Cusco', 'Este', 'hashed_password_125', NOW() - INTERVAL '3 months', TRUE, TRUE, FALSE, FALSE),
('Ana García Flores', 'ana.garcia@example.com', '+51 987 654 324', 'Pasaje Alterno 321', 'Cusco', 'Oeste', 'hashed_password_126', NOW() - INTERVAL '2 months', TRUE, FALSE, FALSE, TRUE),
('Roberto Sánchez Silva', 'roberto.sanchez@example.com', '+51 987 654 325', 'Avenida del Parque 654', 'Cusco', 'Norte', 'hashed_password_127', NOW() - INTERVAL '1 month', TRUE, TRUE, TRUE, FALSE);

-- ============================================================================
-- INSERTAR AUTORIDADES DE EJEMPLO
-- ============================================================================

INSERT INTO autoridades (nombre_completo, email, telefono, numero_empleado, departamento, cargo, distrito_asignado, contraseña_hash, fecha_ingreso, verificado, activo, rol, nivel_permiso) 
VALUES 
('Lucía Méndez López', 'lucia.mendez@municipio.gov', '+51 991 234 567', 'AUT001', 'Alcaldía', 'DIAT', 'Norte', 'hashed_password_auth_001', NOW() - INTERVAL '3 years', TRUE, TRUE, 'Administrador', 3),
('Carlos Ramírez Ruiz', 'carlos.ramirez@municipio.gov', '+51 991 234 568', 'AUT002', 'Infraestructura', 'Supervisor de Vialidad', 'Norte', 'hashed_password_auth_002', NOW() - INTERVAL '2 years', TRUE, TRUE, 'Supervisor', 2),
('Martina Flores Quispe', 'martina.flores@municipio.gov', '+51 991 234 569', 'AUT003', 'Limpieza Pública', 'Técnico de Limpieza', 'Sur', 'hashed_password_auth_003', NOW() - INTERVAL '18 months', TRUE, TRUE, 'Técnico', 1),
('Jorge Ticona Apaza', 'jorge.ticona@municipio.gov', '+51 991 234 570', 'AUT004', 'Electricidad', 'Operador de Alumbrado', 'Este', 'hashed_password_auth_004', NOW() - INTERVAL '1 year', TRUE, TRUE, 'Operador', 1),
('Patricia Condori Mamani', 'patricia.condori@municipio.gov', '+51 991 234 571', 'AUT005', 'Análisis', 'Analista de Datos', 'Oeste', 'hashed_password_auth_005', NOW() - INTERVAL '6 months', TRUE, TRUE, 'Analista', 2);

-- ============================================================================
-- INSERTAR DENUNCIAS DE EJEMPLO
-- ============================================================================

INSERT INTO denuncias (ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, estado, fecha_reporte, prioridad) 
VALUES 
(1, 'Bache peligroso en Avenida Principal', 'Existe un bache de aproximadamente 2 metros que representa un peligro para los vehículos', 'Vialidad', 'Avenida Principal 1200', -13.5320, -71.9787, 'Norte', 'Resuelta', NOW() - INTERVAL '30 days', 'Alta'),
(2, 'Farola de alumbrado rota', 'La farola de la esquina con la calle secundaria está completamente apagada desde hace una semana', 'Alumbrado Público', 'Calle Principal esquina Secundaria', -13.5325, -71.9790, 'Sur', 'En Progreso', NOW() - INTERVAL '10 days', 'Media'),
(3, 'Acumulación de basura', 'Hay acumulación de basura y residuos en la zona de espera', 'Basura', 'Calle Secundaria 456', -13.5330, -71.9795, 'Este', 'Pendiente', NOW() - INTERVAL '5 days', 'Alta'),
(4, 'Grafiti en muro público', 'Muro completamente grafiteado con símbolos y escrituras inapropiadas', 'Grafiti', 'Pasaje Alterno 321', -13.5335, -71.9800, 'Oeste', 'Pendiente', NOW() - INTERVAL '3 days', 'Baja'),
(5, 'Señal de tránsito dañada', 'La señal de ceda el paso está doblada y no se ve correctamente', 'Señales', 'Avenida del Parque 654', -13.5340, -71.9805, 'Norte', 'En Progreso', NOW() - INTERVAL '2 days', 'Media');

-- ============================================================================
-- INSERTAR ASIGNACIONES DE DENUNCIAS
-- ============================================================================

INSERT INTO asignacion_denuncia (denuncia_id, autoridad_id, fecha_asignacion, estado_asignacion) 
VALUES 
(1, 2, NOW() - INTERVAL '30 days', 'Completada'),
(2, 2, NOW() - INTERVAL '10 days', 'En Proceso'),
(3, 3, NOW() - INTERVAL '5 days', 'Pendiente'),
(4, 1, NOW() - INTERVAL '3 days', 'Pendiente'),
(5, 4, NOW() - INTERVAL '2 days', 'En Proceso');

-- ============================================================================
-- INSERTAR EQUIPOS MUNICIPALES DE EJEMPLO
-- ============================================================================

INSERT INTO equipos_municipales (nombre_equipo, descripcion, distrito, categoria_especialidad, jefe_equipo_id, miembros_cantidad, activo) 
VALUES 
('Equipo de Vialidad - Norte', 'Encargado de reparación de calles, baches y señales', 'Norte', 'Vialidad', 2, 8, TRUE),
('Equipo de Limpieza - Sur', 'Equipo de limpieza y recolección de basura', 'Sur', 'Basura', 3, 12, TRUE),
('Equipo de Electricidad - Este', 'Mantenimiento de alumbrado público y eléctrico', 'Este', 'Alumbrado Público', 4, 6, TRUE),
('Equipo de Grafiti - Oeste', 'Limpieza y reparación de grafitis', 1, 'Grafiti', 1, 4, TRUE);

-- ============================================================================
-- INSERTAR MIEMBROS DE EQUIPOS
-- ============================================================================

INSERT INTO miembros_equipo (equipo_id, autoridad_id, fecha_incorporacion, rol_en_equipo) 
VALUES 
(1, 2, NOW() - INTERVAL '2 years', 'Jefe del Equipo'),
(2, 3, NOW() - INTERVAL '18 months', 'Técnico Principal'),
(3, 4, NOW() - INTERVAL '1 year', 'Jefe del Equipo'),
(4, 1, NOW() - INTERVAL '2 years', 'Coordinador');

-- ============================================================================
-- INSERTAR ACTUALIZACIONES DE AUTORIDADES
-- ============================================================================

INSERT INTO actualizaciones_autoridad (denuncia_id, autoridad_id, tipo_actualizacion, descripcion, visible_para_ciudadano) 
VALUES 
(1, 2, 'completacion', 'Se ha reparado exitosamente el bache. Se aplicó asfalto nuevo y se realizaron compactaciones.', TRUE),
(2, 2, 'progreso', 'Se ha programado la reparación para el próximo martes. Ya se cuenta con materiales.', TRUE),
(5, 4, 'progreso', 'Se ha verificado el daño en la señal. Se ordenó reemplazo de la misma.', TRUE);

-- ============================================================================
-- INSERTAR ACTUALIZACIONES DE DENUNCIAS
-- ============================================================================

INSERT INTO actualizaciones_denuncia (denuncia_id, tipo_actualizacion, descripcion, autor, visible_publicamente) 
VALUES 
(1, 'estado_cambio', 'El estado ha cambiado a Resuelta', 'Carlos Ramírez', TRUE),
(2, 'estado_cambio', 'El estado ha cambiado a En Progreso', 'Carlos Ramírez', TRUE),
(3, 'comentario_autoridad', 'Se está coordinando con el equipo de limpieza para limpiar la zona', 'Martina Flores', TRUE);

-- ============================================================================
-- INSERTAR HISTORIAL DE ESTADOS
-- ============================================================================

INSERT INTO historial_estado_denuncia (denuncia_id, estado_anterior, estado_nuevo, motivo, cambiado_por) 
VALUES 
(1, 'Pendiente', 'En Progreso', 'Asignada a equipo de vialidad', 'Carlos Ramírez'),
(1, 'En Progreso', 'Resuelta', 'Reparación completada exitosamente', 'Carlos Ramírez'),
(2, 'Pendiente', 'En Progreso', 'Asignada a equipo de electricidad', 'Carlos Ramírez'),
(5, 'Pendiente', 'En Progreso', 'Asignada a equipo de señalética', 'Jorge Ticona');

-- ============================================================================
-- INSERTAR COMENTARIOS
-- ============================================================================

INSERT INTO comentarios_denuncia (denuncia_id, ciudadano_id, contenido, visible) 
VALUES 
(1, 1, 'Gracias por la pronta respuesta y reparación del bache', TRUE),
(2, 2, 'Espero que se resuelva lo antes posible. Afecta mucho la circulación', TRUE),
(3, 3, 'Es urgente limpiar esa zona, hay mal olor', TRUE);

-- ============================================================================
-- INSERTAR NOTIFICACIONES PARA CIUDADANOS
-- ============================================================================

INSERT INTO notificaciones_ciudadano (ciudadano_id, denuncia_id, tipo_notificacion, mensaje, leida) 
VALUES 
(1, 1, 'estado_cambio', 'Tu denuncia "Bache peligroso en Avenida Principal" ha sido resuelta.', TRUE),
(2, 2, 'estado_cambio', 'Tu denuncia "Farola de alumbrado rota" está ahora en proceso.', FALSE),
(3, 3, 'comentario_nuevo', 'Se agregó una actualización a tu denuncia "Acumulación de basura".', FALSE);

-- ============================================================================
-- INSERTAR CALIFICACIONES
-- ============================================================================

INSERT INTO calificaciones_denuncia (denuncia_id, ciudadano_id, calificacion, comentario) 
VALUES 
(1, 1, 5, 'Excelente trabajo, problema resuelto muy rápidamente'),
(2, 2, 4, 'Buen servicio, espero se complete pronto la reparación');

-- ============================================================================
-- INSERTAR NOTIFICACIONES DE SISTEMA
-- ============================================================================

INSERT INTO notificaciones_sistema (autoridad_id, tipo_notificacion, mensaje, leida) 
VALUES 
(2, 'nueva_denuncia', 'Nueva denuncia asignada: Farola de alumbrado rota', TRUE),
(3, 'denuncia_urgente', 'Denuncia urgente asignada: Acumulación de basura', FALSE),
(4, 'nueva_denuncia', 'Nueva denuncia asignada: Señal de tránsito dañada', TRUE);

-- ============================================================================
-- INSERTAR CONFIGURACIÓN DEL SISTEMA
-- ============================================================================

INSERT INTO configuracion_sistema (clave, valor, tipo_dato, descripcion) 
VALUES 
('tiempo_resolucion_objetivo_dias', '7', 'integer', 'Días objetivo para resolver una denuncia'),
('email_notificaciones_sistema', 'denuncias@municipio.gov', 'string', 'Email para notificaciones del sistema'),
('permite_denuncias_anonimas', 'false', 'boolean', 'Permitir denuncias anónimas'),
('mapas_api_key', 'AIzaSyD...', 'string', 'API key para Google Maps'),
('habilitar_modo_mantenimiento', 'false', 'boolean', 'Modo de mantenimiento de la plataforma'),
('idioma_predeterminado', 'es', 'string', 'Idioma predeterminado del sistema');

-- ============================================================================
-- INSERTAR PLANTILLAS DE RESPUESTA
-- ============================================================================

INSERT INTO plantillas_respuesta (nombre, contenido, tipo_denuncia, autoridad_creador_id, activa) 
VALUES 
('Acuse de Recibo', 'Hemos recibido tu denuncia y será procesada en la mayor brevedad posible. Te mantendremos informado del avance.', 'General', 2, TRUE),
('Denuncia en Proceso', 'Tu denuncia está siendo atendida por nuestros equipos. Continuaremos informándote del progreso.', 'General', 2, TRUE),
('Denuncia Resuelta', 'Nos complace informarte que el problema reportado ha sido resuelto. Gracias por tu colaboración.', 'General', 2, TRUE),
('Necesita Clarificación', 'Requuerimos mayor información para procesar tu denuncia. Por favor, proporciona detalles adicionales.', 'General', 1, TRUE);

-- ============================================================================
-- INSERTAR ESTADÍSTICAS DIARIAS
-- ============================================================================

INSERT INTO estadisticas_diarias (fecha, total_denuncias_nuevas, total_denuncias_resueltas, total_denuncias_en_proceso, total_denuncias_pendientes, tiempo_resolucion_promedio_horas, categoria_mayor_incidencia, distrito_mayor_incidencia, tasa_satisfaccion_promedio) 
VALUES 
(CURRENT_DATE - INTERVAL '7 days', 12, 8, 3, 15, 48.5, 'Vialidad', 'Norte', 4.6),
(CURRENT_DATE - INTERVAL '6 days', 15, 10, 4, 18, 45.2, 'Basura', 'Sur', 4.5),
(CURRENT_DATE - INTERVAL '5 days', 10, 7, 5, 16, 52.3, 'Alumbrado Público', 'Este', 4.4),
(CURRENT_DATE - INTERVAL '4 days', 14, 9, 4, 17, 50.1, 'Vialidad', 'Norte', 4.7),
(CURRENT_DATE - INTERVAL '3 days', 11, 8, 3, 15, 48.9, 'Grafiti', 'Oeste', 4.5);

-- ============================================================================
-- INSERTAR REPORTES POR CATEGORÍA
-- ============================================================================

INSERT INTO reporte_categoria (mes, categoria, cantidad, resueltas, pendientes, en_progreso) 
VALUES 
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Vialidad', 45, 35, 5, 5),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Basura', 38, 28, 6, 4),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Alumbrado Público', 22, 16, 3, 3),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Grafiti', 15, 12, 2, 1),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Señales', 18, 14, 2, 2);

-- ============================================================================
-- INSERTAR REPORTES POR DISTRITO
-- ============================================================================

INSERT INTO reporte_distrito (mes, distrito, cantidad_denuncias, cantidad_resueltas, autoridades_activas) 
VALUES 
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Norte', 52, 40, 3),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Sur', 38, 28, 2),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Este', 32, 24, 2),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Oeste', 16, 12, 1);

-- ============================================================================
-- INSERTAR RENDIMIENTO DE AUTORIDADES
-- ============================================================================

INSERT INTO rendimiento_autoridad (autoridad_id, mes, denuncias_asignadas, denuncias_completadas, tiempo_promedio_resolucion_horas, tasa_satisfaccion, rating_performance) 
VALUES 
(2, DATE_TRUNC('month', CURRENT_DATE)::date, 25, 22, 45.5, 4.8, 'Excelente'),
(3, DATE_TRUNC('month', CURRENT_DATE)::date, 18, 15, 52.3, 4.6, 'Excelente'),
(4, DATE_TRUNC('month', CURRENT_DATE)::date, 12, 10, 48.9, 4.5, 'Bueno'),
(5, DATE_TRUNC('month', CURRENT_DATE)::date, 8, 7, 55.2, 4.3, 'Bueno');

-- ============================================================================
-- CONFIRMACIÓN DE INSERCIONES
-- ============================================================================

/*
Las inserciones se han completado exitosamente:
- 5 ciudadanos registrados
- 5 autoridades registradas
- 5 denuncias de ejemplo
- 4 equipos municipales
- Estadísticas y reportes generados
- Sistema completamente funcional para pruebas

El sistema está listo para comenzar a recibir denuncias reales.
*/
