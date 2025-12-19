-- ============================================================================
-- BASE DE DATOS PARA SISTEMA DE DENUNCIAS CIUDADANAS
-- Plataforma de reportes urbanos y gestiÃ³n municipal
-- ============================================================================

-- ============================================================================
-- PARTE 0: LIMPIEZA (DROP TABLES)
-- ============================================================================
DROP TABLE IF EXISTS calificaciones_denuncia CASCADE;
DROP TABLE IF EXISTS notificaciones_ciudadano CASCADE;
DROP TABLE IF EXISTS comentarios_denuncia CASCADE;
DROP TABLE IF EXISTS historial_estado_denuncia CASCADE;
DROP TABLE IF EXISTS actualizaciones_denuncia CASCADE;
DROP TABLE IF EXISTS tareas_equipo CASCADE;
DROP TABLE IF EXISTS miembros_equipo CASCADE;
DROP TABLE IF EXISTS equipos_municipales CASCADE;
DROP TABLE IF EXISTS actualizaciones_autoridad CASCADE;
DROP TABLE IF EXISTS asignacion_denuncia CASCADE;
DROP TABLE IF EXISTS autoridades CASCADE;
DROP TABLE IF EXISTS denuncias CASCADE;
DROP TABLE IF EXISTS ciudadanos CASCADE;
DROP TABLE IF EXISTS estadisticas_diarias CASCADE;
DROP TABLE IF EXISTS reporte_categoria CASCADE;
DROP TABLE IF EXISTS reporte_distrito CASCADE;
DROP TABLE IF EXISTS rendimiento_autoridad CASCADE;
DROP TABLE IF EXISTS configuracion_sistema CASCADE;
DROP TABLE IF EXISTS registro_actividades CASCADE;
DROP TABLE IF EXISTS notificaciones_sistema CASCADE;
DROP TABLE IF EXISTS plantillas_respuesta CASCADE;

-- ============================================================================
-- PARTE 1: TABLAS DE USUARIOS CIUDADANOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS ciudadanos (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    distrito VARCHAR(100),
    fotografia_perfil BYTEA,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    verificado BOOLEAN DEFAULT FALSE,
    token_verificacion VARCHAR(255),
    fecha_verificacion TIMESTAMP,
    notificaciones_email BOOLEAN DEFAULT TRUE,
    notificaciones_push BOOLEAN DEFAULT FALSE,
    boletin_informativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de denuncias/reportes ciudadanos
CREATE TABLE IF NOT EXISTS denuncias (
    id SERIAL PRIMARY KEY,
    ciudadano_id INTEGER NOT NULL REFERENCES ciudadanos(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(100) NOT NULL, -- Vialidad, Alumbrado PÃºblico, Basura, Grafiti, SeÃ±ales, Otros
    ubicacion VARCHAR(255) NOT NULL,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    distrito VARCHAR(100),
    fotografia BYTEA,
    estado VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, En Progreso, Resuelta, Rechazada
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    comentarios_ciudadano TEXT,
    prioridad VARCHAR(20) DEFAULT 'Media', -- Baja, Media, Alta, CrÃ­tica
    visible_publicamente BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de actualizaciones de denuncias
CREATE TABLE IF NOT EXISTS actualizaciones_denuncia (
    id SERIAL PRIMARY KEY,
    denuncia_id INTEGER NOT NULL REFERENCES denuncias(id) ON DELETE CASCADE,
    tipo_actualizacion VARCHAR(100), -- estado_cambio, comentario_autoridad, foto_adjunta
    descripcion TEXT,
    autor VARCHAR(255), -- puede ser ciudadano o autoridad
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visible_publicamente BOOLEAN DEFAULT TRUE
);

-- Tabla de historial de estados de denuncias
CREATE TABLE IF NOT EXISTS historial_estado_denuncia (
    id SERIAL PRIMARY KEY,
    denuncia_id INTEGER NOT NULL REFERENCES denuncias(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    motivo VARCHAR(255),
    cambiado_por VARCHAR(255),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de comentarios en denuncias
CREATE TABLE IF NOT EXISTS comentarios_denuncia (
    id SERIAL PRIMARY KEY,
    denuncia_id INTEGER NOT NULL REFERENCES denuncias(id) ON DELETE CASCADE,
    ciudadano_id INTEGER REFERENCES ciudadanos(id) ON DELETE SET NULL,
    contenido TEXT NOT NULL,
    fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visible BOOLEAN DEFAULT TRUE
);

-- Tabla de notificaciones para ciudadanos
CREATE TABLE IF NOT EXISTS notificaciones_ciudadano (
    id SERIAL PRIMARY KEY,
    ciudadano_id INTEGER NOT NULL REFERENCES ciudadanos(id) ON DELETE CASCADE,
    denuncia_id INTEGER REFERENCES denuncias(id) ON DELETE CASCADE,
    tipo_notificacion VARCHAR(100), -- estado_cambio, comentario_nuevo, respuesta
    mensaje TEXT,
    leida BOOLEAN DEFAULT FALSE,
    fecha_notificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP
);

-- Tabla de calificaciones de denuncias
CREATE TABLE IF NOT EXISTS calificaciones_denuncia (
    id SERIAL PRIMARY KEY,
    denuncia_id INTEGER NOT NULL REFERENCES denuncias(id) ON DELETE CASCADE,
    ciudadano_id INTEGER NOT NULL REFERENCES ciudadanos(id) ON DELETE CASCADE,
    calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PARTE 2: TABLAS DE AUTORIDADES/MUNICIPALES
-- ============================================================================

CREATE TABLE IF NOT EXISTS autoridades (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    numero_empleado VARCHAR(50) UNIQUE,
    departamento VARCHAR(100),
    cargo VARCHAR(100),
    distrito_asignado VARCHAR(100),
    fotografia_perfil BYTEA,
    password_hash VARCHAR(255) NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    verificado BOOLEAN DEFAULT FALSE,
    rol VARCHAR(50) NOT NULL, -- Operador, Supervisor, Analista, TÃ©cnico, Administrador, Alcalde
    nivel_permiso INTEGER DEFAULT 1, -- 1: Operador bÃ¡sico, 2: Supervisor, 3: Administrador
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asignaciÃ³n de denuncias a autoridades
CREATE TABLE IF NOT EXISTS asignacion_denuncia (
    id SERIAL PRIMARY KEY,
    denuncia_id INTEGER NOT NULL REFERENCES denuncias(id) ON DELETE CASCADE,
    autoridad_id INTEGER NOT NULL REFERENCES autoridades(id) ON DELETE SET NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_completacion TIMESTAMP,
    estado_asignacion VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, En Proceso, Completada, Cancelada
    notas_internas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de actualizaciones internas por autoridades
CREATE TABLE IF NOT EXISTS actualizaciones_autoridad (
    id SERIAL PRIMARY KEY,
    denuncia_id INTEGER NOT NULL REFERENCES denuncias(id) ON DELETE CASCADE,
    autoridad_id INTEGER NOT NULL REFERENCES autoridades(id) ON DELETE SET NULL,
    tipo_actualizacion VARCHAR(100), -- progreso, completacion, rechazo, nota_interna
    descripcion TEXT,
    fotografia_evidencia BYTEA,
    visible_para_ciudadano BOOLEAN DEFAULT FALSE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visible_publicamente BOOLEAN DEFAULT TRUE
);

-- Tabla de equipo de trabajo municipal
CREATE TABLE IF NOT EXISTS equipos_municipales (
    id SERIAL PRIMARY KEY,
    nombre_equipo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    distrito VARCHAR(100),
    categoria_especialidad VARCHAR(100), -- Vialidad, Alumbrado, Limpieza, etc.
    jefe_equipo_id INTEGER REFERENCES autoridades(id) ON DELETE SET NULL,
    miembros_cantidad INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de miembros en equipos
CREATE TABLE IF NOT EXISTS miembros_equipo (
    id SERIAL PRIMARY KEY,
    equipo_id INTEGER NOT NULL REFERENCES equipos_municipales(id) ON DELETE CASCADE,
    autoridad_id INTEGER NOT NULL REFERENCES autoridades(id) ON DELETE CASCADE,
    fecha_incorporacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rol_en_equipo VARCHAR(100)
);

-- Tabla de tareas asignadas a equipos
CREATE TABLE IF NOT EXISTS tareas_equipo (
    id SERIAL PRIMARY KEY,
    denuncia_id INTEGER NOT NULL REFERENCES denuncias(id) ON DELETE CASCADE,
    equipo_id INTEGER NOT NULL REFERENCES equipos_municipales(id) ON DELETE SET NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, En EjecuciÃ³n, Completada
    descripcion_tarea TEXT,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP,
    fecha_completacion TIMESTAMP,
    evidencia_url VARCHAR(500),
    notas_equipo TEXT
);

-- ============================================================================
-- PARTE 3: TABLAS DE ESTADÃSTICAS Y ANÃLISIS
-- ============================================================================

-- Tabla de estadÃ­sticas diarias
CREATE TABLE IF NOT EXISTS estadisticas_diarias (
    id SERIAL PRIMARY KEY,
    fecha DATE DEFAULT CURRENT_DATE,
    total_denuncias_nuevas INTEGER DEFAULT 0,
    total_denuncias_resueltas INTEGER DEFAULT 0,
    total_denuncias_en_proceso INTEGER DEFAULT 0,
    total_denuncias_pendientes INTEGER DEFAULT 0,
    tiempo_resolucion_promedio_horas DECIMAL(10, 2),
    categoria_mayor_incidencia VARCHAR(100),
    distrito_mayor_incidencia VARCHAR(100),
    tasa_satisfaccion_promedio DECIMAL(3, 2)
);

-- Tabla de reporte de denuncias por categorÃ­a
CREATE TABLE IF NOT EXISTS reporte_categoria (
    id SERIAL PRIMARY KEY,
    mes DATE,
    categoria VARCHAR(100),
    cantidad INTEGER,
    resueltas INTEGER,
    pendientes INTEGER,
    en_progreso INTEGER
);

-- Tabla de reporte por distrito
CREATE TABLE IF NOT EXISTS reporte_distrito (
    id SERIAL PRIMARY KEY,
    mes DATE,
    distrito VARCHAR(100),
    cantidad_denuncias INTEGER,
    cantidad_resueltas INTEGER,
    autoridades_activas INTEGER
);

-- Tabla de rendimiento de autoridades
CREATE TABLE IF NOT EXISTS rendimiento_autoridad (
    id SERIAL PRIMARY KEY,
    autoridad_id INTEGER NOT NULL REFERENCES autoridades(id) ON DELETE CASCADE,
    mes DATE,
    denuncias_asignadas INTEGER DEFAULT 0,
    denuncias_completadas INTEGER DEFAULT 0,
    tiempo_promedio_resolucion_horas DECIMAL(10, 2),
    tasa_satisfaccion DECIMAL(3, 2),
    rating_performance VARCHAR(20) -- Excelente, Bueno, Regular, Necesita Mejora
);

-- ============================================================================
-- PARTE 4: TABLAS DE CONFIGURACIÃ“N Y SISTEMA
-- ============================================================================

-- Tabla de configuraciÃ³n municipal
CREATE TABLE IF NOT EXISTS configuracion_sistema (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo_dato VARCHAR(50), -- string, integer, boolean, json
    descripcion TEXT,
    modificado_por INTEGER REFERENCES autoridades(id),
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de registro de actividades (audit log)
CREATE TABLE IF NOT EXISTS registro_actividades (
    id SERIAL PRIMARY KEY,
    usuario_tipo VARCHAR(50), -- ciudadano, autoridad
    usuario_id INTEGER,
    accion VARCHAR(255),
    tabla_afectada VARCHAR(100),
    registro_id INTEGER,
    valores_anteriores JSONB,
    valores_nuevos JSONB,
    fecha_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- Tabla de notificaciones del sistema
CREATE TABLE IF NOT EXISTS notificaciones_sistema (
    id SERIAL PRIMARY KEY,
    autoridad_id INTEGER NOT NULL REFERENCES autoridades(id) ON DELETE CASCADE,
    tipo_notificacion VARCHAR(100), -- nueva_denuncia, denuncia_urgente, mantenimiento, aviso
    mensaje TEXT,
    leida BOOLEAN DEFAULT FALSE,
    fecha_notificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP
);

-- Tabla de plantillas de respuesta
CREATE TABLE IF NOT EXISTS plantillas_respuesta (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    tipo_denuncia VARCHAR(100),
    autoridad_creador_id INTEGER REFERENCES autoridades(id) ON DELETE SET NULL,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PARTE 5: ÃNDICES PARA OPTIMIZACIÃ“N
-- ============================================================================

-- Ãndices para ciudadanos
CREATE INDEX idx_ciudadanos_email ON ciudadanos(email);
CREATE INDEX idx_ciudadanos_distrito ON ciudadanos(distrito);
CREATE INDEX idx_ciudadanos_activo ON ciudadanos(activo);

-- Ãndices para denuncias
CREATE INDEX idx_denuncias_ciudadano_id ON denuncias(ciudadano_id);
CREATE INDEX idx_denuncias_estado ON denuncias(estado);
CREATE INDEX idx_denuncias_categoria ON denuncias(categoria);
CREATE INDEX idx_denuncias_distrito ON denuncias(distrito);
CREATE INDEX idx_denuncias_fecha_reporte ON denuncias(fecha_reporte);
CREATE INDEX idx_denuncias_prioridad ON denuncias(prioridad);

-- Ãndices para autoridades
CREATE INDEX idx_autoridades_email ON autoridades(email);
CREATE INDEX idx_autoridades_rol ON autoridades(rol);
CREATE INDEX idx_autoridades_distrito_asignado ON autoridades(distrito_asignado);
CREATE INDEX idx_autoridades_activo ON autoridades(activo);

-- Ãndices para asignaciones
CREATE INDEX idx_asignacion_denuncia_id ON asignacion_denuncia(denuncia_id);
CREATE INDEX idx_asignacion_autoridad_id ON asignacion_denuncia(autoridad_id);
CREATE INDEX idx_asignacion_estado ON asignacion_denuncia(estado_asignacion);

-- Ãndices para actualizaciones
CREATE INDEX idx_actualizaciones_denuncia ON actualizaciones_autoridad(denuncia_id);
CREATE INDEX idx_actualizaciones_autoridad ON actualizaciones_autoridad(autoridad_id);

-- Ãndices para notificaciones
CREATE INDEX idx_notificaciones_ciudadano ON notificaciones_ciudadano(ciudadano_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones_ciudadano(leida);
CREATE INDEX idx_notificaciones_sistema ON notificaciones_sistema(autoridad_id);

-- Ãndices para estadÃ­sticas
CREATE INDEX idx_estadisticas_fecha ON estadisticas_diarias(fecha);
CREATE INDEX idx_reporte_categoria_mes ON reporte_categoria(mes);
CREATE INDEX idx_reporte_distrito_mes ON reporte_distrito(mes);
CREATE INDEX idx_rendimiento_autoridad_mes ON rendimiento_autoridad(mes);

-- ============================================================================
-- COMENTARIOS Y DOCUMENTACIÃ“N
-- ============================================================================

/*
DESCRIPCIÃ“N GENERAL DE LA BASE DE DATOS:

1. TABLAS DE CIUDADANOS:
   - ciudadanos: InformaciÃ³n personal y de acceso de ciudadanos
   - denuncias: Reportes creados por ciudadanos
   - actualizaciones_denuncia: Historial de cambios en denuncias
   - historial_estado_denuncia: Registro de cambios de estado
   - comentarios_denuncia: InteracciÃ³n ciudadana en denuncias
   - notificaciones_ciudadano: Sistema de alertas para ciudadanos
   - calificaciones_denuncia: SatisfacciÃ³n del ciudadano

2. TABLAS DE AUTORIDADES:
   - autoridades: Personal municipal y administrativo
   - asignacion_denuncia: AsignaciÃ³n de trabajo a autoridades
   - actualizaciones_autoridad: Actualizaciones internas por autoridades
   - equipos_municipales: Equipos de trabajo
   - miembros_equipo: Integrantes de equipos
   - tareas_equipo: Trabajos asignados a equipos
   - notificaciones_sistema: Alertas para autoridades

3. TABLAS DE ANÃLISIS:
   - estadisticas_diarias: KPIs diarios
   - reporte_categoria: AnÃ¡lisis por tipo de problema
   - reporte_distrito: AnÃ¡lisis por zona geogrÃ¡fica
   - rendimiento_autoridad: EvaluaciÃ³n de desempeÃ±o

4. TABLAS DE SISTEMA:
   - configuracion_sistema: ParÃ¡metros configurables
   - registro_actividades: AuditorÃ­a completa
   - plantillas_respuesta: Textos predefinidos

FLUJO DE UNA DENUNCIA:
1. Ciudadano crea denuncia en denuncias
2. Se crea registro en actualizaciones_denuncia
3. Se asigna a autoridad en asignacion_denuncia
4. Autoridad crea tareas_equipo para su equipo
5. Equipo realiza actualizaciones en actualizaciones_autoridad
6. Se actualiza estado en denuncias y historial_estado_denuncia
7. Se notifica al ciudadano vÃ­a notificaciones_ciudadano
8. Al finalizar, ciudadano puede calificar en calificaciones_denuncia
*/
-- ============================================================================
-- DATOS DE EJEMPLO PARA BASE DE DATOS DEL SISTEMA DE DENUNCIAS
-- ============================================================================

-- ============================================================================
-- INSERTAR CIUDADANOS DE EJEMPLO
-- ============================================================================

INSERT INTO ciudadanos (nombre_completo, email, telefono, direccion, ciudad, distrito, password_hash, fecha_registro, verificado, notificaciones_email, notificaciones_push, boletin_informativo) 
VALUES 
('Juan PÃ©rez GarcÃ­a', 'juan.perez@example.com', '+51 987 654 321', 'Calle Principal 123', 'Cusco', 'Norte', 'hashed_password_123', NOW() - INTERVAL '6 months', TRUE, TRUE, FALSE, TRUE),
('MarÃ­a LÃ³pez RodrÃ­guez', 'maria.lopez@example.com', '+51 987 654 322', 'Avenida Central 456', 'Cusco', 'Sur', 'hashed_password_124', NOW() - INTERVAL '4 months', TRUE, TRUE, TRUE, TRUE),
('Carlos Mendez Torres', 'carlos.mendez@example.com', '+51 987 654 323', 'Calle Secundaria 789', 'Cusco', 'Este', 'hashed_password_125', NOW() - INTERVAL '3 months', TRUE, TRUE, FALSE, FALSE),
('Ana GarcÃ­a Flores', 'ana.garcia@example.com', '+51 987 654 324', 'Pasaje Alterno 321', 'Cusco', 'Oeste', 'hashed_password_126', NOW() - INTERVAL '2 months', TRUE, FALSE, FALSE, TRUE),
('Roberto SÃ¡nchez Silva', 'roberto.sanchez@example.com', '+51 987 654 325', 'Avenida del Parque 654', 'Cusco', 'Norte', 'hashed_password_127', NOW() - INTERVAL '1 month', TRUE, TRUE, TRUE, FALSE);

-- ============================================================================
-- INSERTAR AUTORIDADES DE EJEMPLO
-- ============================================================================

INSERT INTO autoridades (nombre_completo, email, telefono, numero_empleado, departamento, cargo, distrito_asignado, password_hash, fecha_ingreso, verificado, activo, rol, nivel_permiso) 
VALUES 
('LucÃ­a MÃ©ndez LÃ³pez', 'lucia.mendez@municipio.gov', '+51 991 234 567', 'AUT001', 'AlcaldÃ­a', 'DIAT', 'Norte', 'hashed_password_auth_001', NOW() - INTERVAL '3 years', TRUE, TRUE, 'Administrador', 3),
('Carlos RamÃ­rez Ruiz', 'carlos.ramirez@municipio.gov', '+51 991 234 568', 'AUT002', 'Infraestructura', 'Supervisor de Vialidad', 'Norte', 'hashed_password_auth_002', NOW() - INTERVAL '2 years', TRUE, TRUE, 'Supervisor', 2),
('Martina Flores Quispe', 'martina.flores@municipio.gov', '+51 991 234 569', 'AUT003', 'Limpieza PÃºblica', 'TÃ©cnico de Limpieza', 'Sur', 'hashed_password_auth_003', NOW() - INTERVAL '18 months', TRUE, TRUE, 'TÃ©cnico', 1),
('Jorge Ticona Apaza', 'jorge.ticona@municipio.gov', '+51 991 234 570', 'AUT004', 'Electricidad', 'Operador de Alumbrado', 'Este', 'hashed_password_auth_004', NOW() - INTERVAL '1 year', TRUE, TRUE, 'Operador', 1),
('Patricia Condori Mamani', 'patricia.condori@municipio.gov', '+51 991 234 571', 'AUT005', 'AnÃ¡lisis', 'Analista de Datos', 'Oeste', 'hashed_password_auth_005', NOW() - INTERVAL '6 months', TRUE, TRUE, 'Analista', 2);

-- ============================================================================
-- INSERTAR DENUNCIAS DE EJEMPLO
-- ============================================================================

INSERT INTO denuncias (ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, estado, fecha_reporte, prioridad) 
VALUES 
(1, 'Bache peligroso en Avenida Principal', 'Existe un bache de aproximadamente 2 metros que representa un peligro para los vehÃ­culos', 'Vialidad', 'Avenida Principal 1200', -13.5320, -71.9787, 'Norte', 'Resuelta', NOW() - INTERVAL '30 days', 'Alta'),
(2, 'Farola de alumbrado rota', 'La farola de la esquina con la calle secundaria estÃ¡ completamente apagada desde hace una semana', 'Alumbrado PÃºblico', 'Calle Principal esquina Secundaria', -13.5325, -71.9790, 'Sur', 'En Progreso', NOW() - INTERVAL '10 days', 'Media'),
(3, 'AcumulaciÃ³n de basura', 'Hay acumulaciÃ³n de basura y residuos en la zona de espera', 'Basura', 'Calle Secundaria 456', -13.5330, -71.9795, 'Este', 'Pendiente', NOW() - INTERVAL '5 days', 'Alta'),
(4, 'Grafiti en muro pÃºblico', 'Muro completamente grafiteado con sÃ­mbolos y escrituras inapropiadas', 'Grafiti', 'Pasaje Alterno 321', -13.5335, -71.9800, 'Oeste', 'Pendiente', NOW() - INTERVAL '3 days', 'Baja'),
(5, 'SeÃ±al de trÃ¡nsito daÃ±ada', 'La seÃ±al de ceda el paso estÃ¡ doblada y no se ve correctamente', 'SeÃ±ales', 'Avenida del Parque 654', -13.5340, -71.9805, 'Norte', 'En Progreso', NOW() - INTERVAL '2 days', 'Media');

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
('Equipo de Vialidad - Norte', 'Encargado de reparaciÃ³n de calles, baches y seÃ±ales', 'Norte', 'Vialidad', 2, 8, TRUE),
('Equipo de Limpieza - Sur', 'Equipo de limpieza y recolecciÃ³n de basura', 'Sur', 'Basura', 3, 12, TRUE),
('Equipo de Electricidad - Este', 'Mantenimiento de alumbrado pÃºblico y elÃ©ctrico', 'Este', 'Alumbrado PÃºblico', 4, 6, TRUE),
('Equipo de Grafiti - Oeste', 'Limpieza y reparaciÃ³n de grafitis', 1, 'Grafiti', 1, 4, TRUE);

-- ============================================================================
-- INSERTAR MIEMBROS DE EQUIPOS
-- ============================================================================

INSERT INTO miembros_equipo (equipo_id, autoridad_id, fecha_incorporacion, rol_en_equipo) 
VALUES 
(1, 2, NOW() - INTERVAL '2 years', 'Jefe del Equipo'),
(2, 3, NOW() - INTERVAL '18 months', 'TÃ©cnico Principal'),
(3, 4, NOW() - INTERVAL '1 year', 'Jefe del Equipo'),
(4, 1, NOW() - INTERVAL '2 years', 'Coordinador');

-- ============================================================================
-- INSERTAR ACTUALIZACIONES DE AUTORIDADES
-- ============================================================================

INSERT INTO actualizaciones_autoridad (denuncia_id, autoridad_id, tipo_actualizacion, descripcion, visible_para_ciudadano) 
VALUES 
(1, 2, 'completacion', 'Se ha reparado exitosamente el bache. Se aplicÃ³ asfalto nuevo y se realizaron compactaciones.', TRUE),
(2, 2, 'progreso', 'Se ha programado la reparaciÃ³n para el prÃ³ximo martes. Ya se cuenta con materiales.', TRUE),
(5, 4, 'progreso', 'Se ha verificado el daÃ±o en la seÃ±al. Se ordenÃ³ reemplazo de la misma.', TRUE);

-- ============================================================================
-- INSERTAR ACTUALIZACIONES DE DENUNCIAS
-- ============================================================================

INSERT INTO actualizaciones_denuncia (denuncia_id, tipo_actualizacion, descripcion, autor, visible_publicamente) 
VALUES 
(1, 'estado_cambio', 'El estado ha cambiado a Resuelta', 'Carlos RamÃ­rez', TRUE),
(2, 'estado_cambio', 'El estado ha cambiado a En Progreso', 'Carlos RamÃ­rez', TRUE),
(3, 'comentario_autoridad', 'Se estÃ¡ coordinando con el equipo de limpieza para limpiar la zona', 'Martina Flores', TRUE);

-- ============================================================================
-- INSERTAR HISTORIAL DE ESTADOS
-- ============================================================================

INSERT INTO historial_estado_denuncia (denuncia_id, estado_anterior, estado_nuevo, motivo, cambiado_por) 
VALUES 
(1, 'Pendiente', 'En Progreso', 'Asignada a equipo de vialidad', 'Carlos RamÃ­rez'),
(1, 'En Progreso', 'Resuelta', 'ReparaciÃ³n completada exitosamente', 'Carlos RamÃ­rez'),
(2, 'Pendiente', 'En Progreso', 'Asignada a equipo de electricidad', 'Carlos RamÃ­rez'),
(5, 'Pendiente', 'En Progreso', 'Asignada a equipo de seÃ±alÃ©tica', 'Jorge Ticona');

-- ============================================================================
-- INSERTAR COMENTARIOS
-- ============================================================================

INSERT INTO comentarios_denuncia (denuncia_id, ciudadano_id, contenido, visible) 
VALUES 
(1, 1, 'Gracias por la pronta respuesta y reparaciÃ³n del bache', TRUE),
(2, 2, 'Espero que se resuelva lo antes posible. Afecta mucho la circulaciÃ³n', TRUE),
(3, 3, 'Es urgente limpiar esa zona, hay mal olor', TRUE);

-- ============================================================================
-- INSERTAR NOTIFICACIONES PARA CIUDADANOS
-- ============================================================================

INSERT INTO notificaciones_ciudadano (ciudadano_id, denuncia_id, tipo_notificacion, mensaje, leida) 
VALUES 
(1, 1, 'estado_cambio', 'Tu denuncia "Bache peligroso en Avenida Principal" ha sido resuelta.', TRUE),
(2, 2, 'estado_cambio', 'Tu denuncia "Farola de alumbrado rota" estÃ¡ ahora en proceso.', FALSE),
(3, 3, 'comentario_nuevo', 'Se agregÃ³ una actualizaciÃ³n a tu denuncia "AcumulaciÃ³n de basura".', FALSE);

-- ============================================================================
-- INSERTAR CALIFICACIONES
-- ============================================================================

INSERT INTO calificaciones_denuncia (denuncia_id, ciudadano_id, calificacion, comentario) 
VALUES 
(1, 1, 5, 'Excelente trabajo, problema resuelto muy rÃ¡pidamente'),
(2, 2, 4, 'Buen servicio, espero se complete pronto la reparaciÃ³n');

-- ============================================================================
-- INSERTAR NOTIFICACIONES DE SISTEMA
-- ============================================================================

INSERT INTO notificaciones_sistema (autoridad_id, tipo_notificacion, mensaje, leida) 
VALUES 
(2, 'nueva_denuncia', 'Nueva denuncia asignada: Farola de alumbrado rota', TRUE),
(3, 'denuncia_urgente', 'Denuncia urgente asignada: AcumulaciÃ³n de basura', FALSE),
(4, 'nueva_denuncia', 'Nueva denuncia asignada: SeÃ±al de trÃ¡nsito daÃ±ada', TRUE);

-- ============================================================================
-- INSERTAR CONFIGURACIÃ“N DEL SISTEMA
-- ============================================================================

INSERT INTO configuracion_sistema (clave, valor, tipo_dato, descripcion) 
VALUES 
('tiempo_resolucion_objetivo_dias', '7', 'integer', 'DÃ­as objetivo para resolver una denuncia'),
('email_notificaciones_sistema', 'denuncias@municipio.gov', 'string', 'Email para notificaciones del sistema'),
('permite_denuncias_anonimas', 'false', 'boolean', 'Permitir denuncias anÃ³nimas'),
('mapas_api_key', 'AIzaSyD...', 'string', 'API key para Google Maps'),
('habilitar_modo_mantenimiento', 'false', 'boolean', 'Modo de mantenimiento de la plataforma'),
('idioma_predeterminado', 'es', 'string', 'Idioma predeterminado del sistema');

-- ============================================================================
-- INSERTAR PLANTILLAS DE RESPUESTA
-- ============================================================================

INSERT INTO plantillas_respuesta (nombre, contenido, tipo_denuncia, autoridad_creador_id, activa) 
VALUES 
('Acuse de Recibo', 'Hemos recibido tu denuncia y serÃ¡ procesada en la mayor brevedad posible. Te mantendremos informado del avance.', 'General', 2, TRUE),
('Denuncia en Proceso', 'Tu denuncia estÃ¡ siendo atendida por nuestros equipos. Continuaremos informÃ¡ndote del progreso.', 'General', 2, TRUE),
('Denuncia Resuelta', 'Nos complace informarte que el problema reportado ha sido resuelto. Gracias por tu colaboraciÃ³n.', 'General', 2, TRUE),
('Necesita ClarificaciÃ³n', 'Requuerimos mayor informaciÃ³n para procesar tu denuncia. Por favor, proporciona detalles adicionales.', 'General', 1, TRUE);

-- ============================================================================
-- INSERTAR ESTADÃSTICAS DIARIAS
-- ============================================================================

INSERT INTO estadisticas_diarias (fecha, total_denuncias_nuevas, total_denuncias_resueltas, total_denuncias_en_proceso, total_denuncias_pendientes, tiempo_resolucion_promedio_horas, categoria_mayor_incidencia, distrito_mayor_incidencia, tasa_satisfaccion_promedio) 
VALUES 
(CURRENT_DATE - INTERVAL '7 days', 12, 8, 3, 15, 48.5, 'Vialidad', 'Norte', 4.6),
(CURRENT_DATE - INTERVAL '6 days', 15, 10, 4, 18, 45.2, 'Basura', 'Sur', 4.5),
(CURRENT_DATE - INTERVAL '5 days', 10, 7, 5, 16, 52.3, 'Alumbrado PÃºblico', 'Este', 4.4),
(CURRENT_DATE - INTERVAL '4 days', 14, 9, 4, 17, 50.1, 'Vialidad', 'Norte', 4.7),
(CURRENT_DATE - INTERVAL '3 days', 11, 8, 3, 15, 48.9, 'Grafiti', 'Oeste', 4.5);

-- ============================================================================
-- INSERTAR REPORTES POR CATEGORÃA
-- ============================================================================

INSERT INTO reporte_categoria (mes, categoria, cantidad, resueltas, pendientes, en_progreso) 
VALUES 
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Vialidad', 45, 35, 5, 5),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Basura', 38, 28, 6, 4),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Alumbrado PÃºblico', 22, 16, 3, 3),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'Grafiti', 15, 12, 2, 1),
(DATE_TRUNC('month', CURRENT_DATE)::date, 'SeÃ±ales', 18, 14, 2, 2);

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
-- CONFIRMACIÃ“N DE INSERCIONES
-- ============================================================================

/*
Las inserciones se han completado exitosamente:
- 5 ciudadanos registrados
- 5 autoridades registradas
- 5 denuncias de ejemplo
- 4 equipos municipales
- EstadÃ­sticas y reportes generados
- Sistema completamente funcional para pruebas

El sistema estÃ¡ listo para comenzar a recibir denuncias reales.
*/


-- ============================================================================
-- STORED PROCEDURE FOR STATE MANAGEMENT
-- ============================================================================

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
