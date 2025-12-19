# Sistema de Denuncias Ciudadanas - Base de Datos PostgreSQL

## 📋 Descripción General

Este proyecto incluye una base de datos completa en PostgreSQL para un **Sistema de Denuncias Ciudadanas**. La solución está diseñada para manejar reportes de problemas urbanos desde ciudadanos y su gestión por autoridades municipales.

## 🏗️ Estructura de la Base de Datos

### Tabla 1: CIUDADANOS
Almacena información de usuarios ciudadanos que reportan problemas.

**Campos principales:**
- `id`: Identificador único
- `nombre_completo`: Nombre del ciudadano
- `email`: Email único para autenticación
- `telefono`: Contacto telefónico
- `direccion`, `ciudad`, `distrito`: Ubicación
- `fotografia_perfil`: Foto de perfil en bytes
- `contraseña_hash`: Contraseña hasheada (bcrypt)
- `notificaciones_email`, `notificaciones_push`: Preferencias
- `activo`, `verificado`: Estado de la cuenta

### Tabla 2: DENUNCIAS
Reportes de problemas urbanos creados por ciudadanos.

**Campos principales:**
- `id`: Identificador único
- `ciudadano_id`: Referencia al ciudadano que reporta
- `titulo`: Título de la denuncia
- `descripcion`: Descripción detallada
- `categoria`: Tipo de problema (Vialidad, Basura, Grafiti, etc.)
- `ubicacion`, `latitud`, `longitud`: Localización
- `estado`: Pendiente, En Progreso, Resuelta, Rechazada
- `prioridad`: Baja, Media, Alta, Crítica
- `fotografia`: Imagen adjunta del problema

### Tabla 3: AUTORIDADES
Personal municipal y administrativo encargado de resolver denuncias.

**Campos principales:**
- `id`: Identificador único
- `nombre_completo`: Nombre del empleado
- `email`: Email institucional
- `numero_empleado`: ID único del empleado
- `departamento`: Área de trabajo
- `cargo`: Posición laboral
- `rol`: Operador, Supervisor, Analista, Técnico, Administrador
- `nivel_permiso`: Nivel de acceso (1-3)
- `distrito_asignado`: Zona de responsabilidad

### Tablas de Relaciones y Control

| Tabla | Propósito |
|-------|-----------|
| `asignacion_denuncia` | Asigna denuncias a autoridades |
| `actualizaciones_denuncia` | Registro de cambios en denuncias |
| `actualizaciones_autoridad` | Acciones internas de autoridades |
| `historial_estado_denuncia` | Historial completo de cambios de estado |
| `comentarios_denuncia` | Interacción ciudadana |
| `notificaciones_ciudadano` | Alertas para ciudadanos |
| `calificaciones_denuncia` | Satisfacción del cliente |

### Tablas de Gestión Municipal

| Tabla | Propósito |
|-------|-----------|
| `equipos_municipales` | Equipos de trabajo |
| `miembros_equipo` | Integrantes de equipos |
| `tareas_equipo` | Trabajos asignados |
| `notificaciones_sistema` | Alertas para autoridades |

### Tablas de Análisis

| Tabla | Propósito |
|-------|-----------|
| `estadisticas_diarias` | KPIs diarios |
| `reporte_categoria` | Análisis por tipo de problema |
| `reporte_distrito` | Análisis por zona |
| `rendimiento_autoridad` | Evaluación de desempeño |

## 🚀 Instalación

### Requisitos
- PostgreSQL 12 o superior
- Cliente psql o GUI (PgAdmin, DBeaver, etc.)
- Acceso a línea de comandos

### Pasos de Instalación

#### 1. Crear la Base de Datos
```sql
CREATE DATABASE sistema_denuncias
  WITH
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_ES.UTF-8'
  LC_CTYPE = 'es_ES.UTF-8';
```

#### 2. Conectarse a la Base de Datos
```bash
psql -U postgres -d sistema_denuncias
```

O en Windows:
```bash
psql -U postgres -d sistema_denuncias
```

#### 3. Ejecutar Script de Esquema
```bash
\i database/schema.sql
```

#### 4. Cargar Datos de Ejemplo (Opcional)
```bash
\i database/seed_data.sql
```

#### 5. Verificar Instalación
```sql
SELECT COUNT(*) FROM ciudadanos;
SELECT COUNT(*) FROM denuncias;
SELECT COUNT(*) FROM autoridades;
```

## 📊 Flujo de una Denuncia

```
1. CREACIÓN
   └─ Ciudadano crea denuncia → denuncias.id

2. ASIGNACIÓN
   └─ Autoridad asigna a equipo → asignacion_denuncia

3. PROCESAMIENTO
   └─ Equipo actualiza estado → actualizaciones_autoridad
   └─ Se notifica ciudadano → notificaciones_ciudadano

4. RESOLUCIÓN
   └─ Estado cambia a Resuelta → historial_estado_denuncia
   └─ Ciudadano califica → calificaciones_denuncia

5. ANÁLISIS
   └─ Se registran en reportes → estadisticas_diarias
   └─ Se calcula rendimiento → rendimiento_autoridad
```

## 🔍 Consultas Principales

### Dashboard del Ciudadano
```sql
-- Ver mis denuncias
SELECT * FROM denuncias WHERE ciudadano_id = $1
ORDER BY fecha_reporte DESC;

-- Ver notificaciones
SELECT * FROM notificaciones_ciudadano 
WHERE ciudadano_id = $1 AND leida = FALSE;
```

### Dashboard de Autoridad
```sql
-- Ver denuncias asignadas
SELECT d.* FROM denuncias d
JOIN asignacion_denuncia a ON d.id = a.denuncia_id
WHERE a.autoridad_id = $1 AND a.estado_asignacion IN ('Pendiente', 'En Proceso');
```

### Reportes Gerenciales
```sql
-- Denuncias por categoría
SELECT categoria, COUNT(*) FROM denuncias
WHERE fecha_reporte >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY categoria;

-- Ranking de autoridades
SELECT nombre_completo, COUNT(distinct ad.denuncia_id) as denuncias
FROM autoridades a
LEFT JOIN asignacion_denuncia ad ON a.id = ad.autoridad_id
GROUP BY a.id
ORDER BY denuncias DESC;
```

## 🔐 Seguridad

### Implementaciones Recomendadas

1. **Hashing de Contraseñas**
   - Usar bcrypt o Argon2
   - Nunca almacenar contraseñas en plano

2. **Control de Acceso**
   - Implementar RBAC (Role-Based Access Control)
   - Verificar nivel_permiso antes de acciones

3. **Auditoría**
   - Usar tabla `registro_actividades`
   - Registrar todas las modificaciones

4. **Validación**
   - Validar entrada en aplicación
   - Usar prepared statements para evitar SQL injection

5. **Encriptación**
   - Usar HTTPS para datos en tránsito
   - Considerar encriptación de campos sensibles

## 📈 Índices Creados

```
- idx_ciudadanos_email
- idx_ciudadanos_distrito
- idx_denuncias_ciudadano_id
- idx_denuncias_estado
- idx_denuncias_categoria
- idx_denuncias_fecha_reporte
- idx_autoridades_email
- idx_autoridades_rol
- idx_asignacion_denuncia_id
- idx_notificaciones_ciudadano
- idx_estadisticas_fecha
```

## 🛠️ Mantenimiento

### Backup Regular
```bash
pg_dump sistema_denuncias > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restauración
```bash
psql sistema_denuncias < backup_20240115_120000.sql
```

### Limpieza de Datos Antiguos
```sql
DELETE FROM notificaciones_ciudadano 
WHERE fecha_notificacion < CURRENT_DATE - INTERVAL '1 year';

VACUUM ANALYZE;
```

## 📱 Integración con Frontend

### Conexión desde Node.js/React
```javascript
const { Client } = require('pg');

const client = new Client({
  user: 'usuario',
  password: 'contraseña',
  host: 'localhost',
  port: 5432,
  database: 'sistema_denuncias',
});

await client.connect();
const result = await client.query('SELECT * FROM ciudadanos');
```

### Conexión desde Python
```python
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="sistema_denuncias",
    user="usuario",
    password="contraseña"
)

cursor = conn.cursor()
cursor.execute("SELECT * FROM denuncias")
```

## 📊 Estadísticas de Base de Datos

| Elemento | Cantidad |
|----------|----------|
| Tablas | 27 |
| Índices | 20+ |
| Vistas Recomendadas | 8 |
| Funciones | 1+ |
| Restricciones | 15+ |

## 🐛 Solución de Problemas

### Error: "relation does not exist"
- Verificar que se ejecutó correctamente schema.sql
- Confirmar nombre de tabla y columna

### Error: "permission denied"
- Verificar permisos de usuario en PostgreSQL
- Usar superusuario si es necesario

### Rendimiento lento
- Ejecutar `ANALYZE` para actualizar estadísticas
- Verificar índices existan
- Revisar planes de ejecución con `EXPLAIN`

## 📝 Ejemplos de Uso

### Crear una Denuncia
```sql
INSERT INTO denuncias (ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, estado)
VALUES (1, 'Bache en calle', 'Existe un bache peligroso', 'Vialidad', 'Calle Principal 123', -13.5320, -71.9787, 'Norte', 'Pendiente');
```

### Asignar a Autoridad
```sql
INSERT INTO asignacion_denuncia (denuncia_id, autoridad_id, estado_asignacion)
VALUES (1, 2, 'Pendiente');
```

### Actualizar Estado
```sql
UPDATE denuncias 
SET estado = 'Resuelta', fecha_resolucion = CURRENT_TIMESTAMP
WHERE id = 1;
```

## 📞 Soporte

Para consultas o problemas:
- Revisar SETUP_GUIDE.sql
- Consultar documentación de PostgreSQL
- Verificar logs del sistema

## 📄 Licencia

Este proyecto forma parte del Sistema de Denuncias Ciudadanas.

---

**Última actualización:** Noviembre 2024
