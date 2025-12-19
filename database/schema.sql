-- ============================================================================
-- BASE DE DATOS PARA SISTEMA DE DENUNCIAS CIUDADANAS
-- Plataforma de reportes urbanos y gestión municipal
-- ============================================================================

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
    contraseña_hash VARCHAR(255) NOT NULL,
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
    categoria VARCHAR(100) NOT NULL, -- Vialidad, Alumbrado Público, Basura, Grafiti, Señales, Otros
    ubicacion VARCHAR(255) NOT NULL,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    distrito VARCHAR(100),
    fotografia BYTEA,
    estado VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, En Progreso, Resuelta, Rechazada
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    comentarios_ciudadano TEXT,
    prioridad VARCHAR(20) DEFAULT 'Media', -- Baja, Media, Alta, Crítica
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
    visible_para_ciudadano BOOLEAN DEFAULT TRUE
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
    contraseña_hash VARCHAR(255) NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    verificado BOOLEAN DEFAULT FALSE,
    rol VARCHAR(50) NOT NULL, -- Operador, Supervisor, Analista, Técnico, Administrador, Alcalde
    nivel_permiso INTEGER DEFAULT 1, -- 1: Operador básico, 2: Supervisor, 3: Administrador
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asignación de denuncias a autoridades
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
    estado VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, En Ejecución, Completada
    descripcion_tarea TEXT,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP,
    fecha_completacion TIMESTAMP,
    evidencia_url VARCHAR(500),
    notas_equipo TEXT
);

-- ============================================================================
-- PARTE 3: TABLAS DE ESTADÍSTICAS Y ANÁLISIS
-- ============================================================================

-- Tabla de estadísticas diarias
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

-- Tabla de reporte de denuncias por categoría
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
-- PARTE 4: TABLAS DE CONFIGURACIÓN Y SISTEMA
-- ============================================================================

-- Tabla de configuración municipal
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
-- PARTE 5: ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índices para ciudadanos
CREATE INDEX idx_ciudadanos_email ON ciudadanos(email);
CREATE INDEX idx_ciudadanos_distrito ON ciudadanos(distrito);
CREATE INDEX idx_ciudadanos_activo ON ciudadanos(activo);

-- Índices para denuncias
CREATE INDEX idx_denuncias_ciudadano_id ON denuncias(ciudadano_id);
CREATE INDEX idx_denuncias_estado ON denuncias(estado);
CREATE INDEX idx_denuncias_categoria ON denuncias(categoria);
CREATE INDEX idx_denuncias_distrito ON denuncias(distrito);
CREATE INDEX idx_denuncias_fecha_reporte ON denuncias(fecha_reporte);
CREATE INDEX idx_denuncias_prioridad ON denuncias(prioridad);

-- Índices para autoridades
CREATE INDEX idx_autoridades_email ON autoridades(email);
CREATE INDEX idx_autoridades_rol ON autoridades(rol);
CREATE INDEX idx_autoridades_distrito_asignado ON autoridades(distrito_asignado);
CREATE INDEX idx_autoridades_activo ON autoridades(activo);

-- Índices para asignaciones
CREATE INDEX idx_asignacion_denuncia_id ON asignacion_denuncia(denuncia_id);
CREATE INDEX idx_asignacion_autoridad_id ON asignacion_denuncia(autoridad_id);
CREATE INDEX idx_asignacion_estado ON asignacion_denuncia(estado_asignacion);

-- Índices para actualizaciones
CREATE INDEX idx_actualizaciones_denuncia ON actualizaciones_autoridad(denuncia_id);
CREATE INDEX idx_actualizaciones_autoridad ON actualizaciones_autoridad(autoridad_id);

-- Índices para notificaciones
CREATE INDEX idx_notificaciones_ciudadano ON notificaciones_ciudadano(ciudadano_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones_ciudadano(leida);
CREATE INDEX idx_notificaciones_sistema ON notificaciones_sistema(autoridad_id);

-- Índices para estadísticas
CREATE INDEX idx_estadisticas_fecha ON estadisticas_diarias(fecha);
CREATE INDEX idx_reporte_categoria_mes ON reporte_categoria(mes);
CREATE INDEX idx_reporte_distrito_mes ON reporte_distrito(mes);
CREATE INDEX idx_rendimiento_autoridad_mes ON rendimiento_autoridad(mes);

-- ============================================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================================

/*
DESCRIPCIÓN GENERAL DE LA BASE DE DATOS:

1. TABLAS DE CIUDADANOS:
   - ciudadanos: Información personal y de acceso de ciudadanos
   - denuncias: Reportes creados por ciudadanos
   - actualizaciones_denuncia: Historial de cambios en denuncias
   - historial_estado_denuncia: Registro de cambios de estado
   - comentarios_denuncia: Interacción ciudadana en denuncias
   - notificaciones_ciudadano: Sistema de alertas para ciudadanos
   - calificaciones_denuncia: Satisfacción del ciudadano

2. TABLAS DE AUTORIDADES:
   - autoridades: Personal municipal y administrativo
   - asignacion_denuncia: Asignación de trabajo a autoridades
   - actualizaciones_autoridad: Actualizaciones internas por autoridades
   - equipos_municipales: Equipos de trabajo
   - miembros_equipo: Integrantes de equipos
   - tareas_equipo: Trabajos asignados a equipos
   - notificaciones_sistema: Alertas para autoridades

3. TABLAS DE ANÁLISIS:
   - estadisticas_diarias: KPIs diarios
   - reporte_categoria: Análisis por tipo de problema
   - reporte_distrito: Análisis por zona geográfica
   - rendimiento_autoridad: Evaluación de desempeño

4. TABLAS DE SISTEMA:
   - configuracion_sistema: Parámetros configurables
   - registro_actividades: Auditoría completa
   - plantillas_respuesta: Textos predefinidos

FLUJO DE UNA DENUNCIA:
1. Ciudadano crea denuncia en denuncias
2. Se crea registro en actualizaciones_denuncia
3. Se asigna a autoridad en asignacion_denuncia
4. Autoridad crea tareas_equipo para su equipo
5. Equipo realiza actualizaciones en actualizaciones_autoridad
6. Se actualiza estado en denuncias y historial_estado_denuncia
7. Se notifica al ciudadano vía notificaciones_ciudadano
8. Al finalizar, ciudadano puede calificar en calificaciones_denuncia
*/
