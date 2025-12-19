# 📚 Patrón MVC en el Sistema de Denuncias Ciudadanas
## Presentación Teórica

---

## 📋 Índice

1. [¿Qué es el Patrón MVC?](#1-qué-es-el-patrón-mvc)
2. [Componentes del Patrón MVC](#2-componentes-del-patrón-mvc)
3. [Ventajas del Patrón MVC](#3-ventajas-del-patrón-mvc)
4. [MVC en Aplicaciones Web Modernas](#4-mvc-en-aplicaciones-web-modernas)
5. [Estado Actual del Proyecto](#5-estado-actual-del-proyecto)
6. [Aplicación de MVC al Sistema de Denuncias](#6-aplicación-de-mvc-al-sistema-de-denuncias)
7. [Estructura Propuesta](#7-estructura-propuesta)
8. [Ejemplos de Implementación](#8-ejemplos-de-implementación)
9. [Flujo de Datos con MVC](#9-flujo-de-datos-con-mvc)
10. [Conclusiones](#10-conclusiones)

---

## 1. ¿Qué es el Patrón MVC?

### Definición

**MVC (Model-View-Controller)** es un patrón de arquitectura de software que separa la aplicación en tres componentes principales interconectados:

- **Model (Modelo):** Gestiona los datos y la lógica de negocio
- **View (Vista):** Presenta la información al usuario
- **Controller (Controlador):** Maneja la interacción del usuario y coordina Model y View

### Historia

- 📅 **Creado en:** 1979 por Trygve Reenskaug
- 🎯 **Propósito original:** Smalltalk-80 (interfaz gráfica)
- 🌐 **Popularidad:** Adoptado masivamente en desarrollo web (Ruby on Rails, Laravel, ASP.NET MVC)

### Objetivo Principal

> **Separación de Responsabilidades (Separation of Concerns)**
> 
> Dividir la aplicación en capas independientes para mejorar la organización, mantenibilidad y escalabilidad del código.

---

## 2. Componentes del Patrón MVC

### 🗄️ Model (Modelo)

**Responsabilidad:** Gestionar los datos y la lógica de negocio

**Funciones:**
- Acceso a la base de datos (queries SQL)
- Validación de datos
- Reglas de negocio
- Transformación de datos

**Características:**
- ✅ Independiente de la interfaz de usuario
- ✅ Reutilizable en diferentes contextos
- ✅ Contiene la "verdad" de los datos

**Ejemplo conceptual:**
```javascript
// El Model sabe CÓMO obtener y manipular datos
class DenunciaModel {
  static async obtenerTodas() {
    // Query a la base de datos
  }
  
  static async crear(datos) {
    // Validar y crear denuncia
  }
}
```

---

### 🎨 View (Vista)

**Responsabilidad:** Presentar la información al usuario

**Funciones:**
- Renderizar datos en formato visual
- Mostrar información del Model
- Capturar entrada del usuario
- Interfaz de usuario (UI)

**En aplicaciones web modernas:**
- **Backend API:** No hay "View" tradicional (se reemplaza por Routes/Endpoints)
- **Frontend:** React, Vue, Angular actúan como la "View"

**Características:**
- ✅ Solo presenta datos, no los procesa
- ✅ Múltiples vistas pueden usar el mismo Model
- ✅ Actualizable sin afectar la lógica

**Ejemplo conceptual:**
```jsx
// La View solo MUESTRA datos
function ListaDenuncias({ denuncias }) {
  return (
    <div>
      {denuncias.map(d => (
        <DenunciaCard key={d.id} denuncia={d} />
      ))}
    </div>
  );
}
```

---

### 🎮 Controller (Controlador)

**Responsabilidad:** Intermediario entre Model y View

**Funciones:**
- Recibir peticiones del usuario
- Invocar métodos del Model
- Seleccionar la View apropiada
- Manejar errores
- Coordinar flujo de datos

**Características:**
- ✅ Lógica de aplicación (no de negocio)
- ✅ Orquesta la interacción
- ✅ Delgado (thin controllers)

**Ejemplo conceptual:**
```javascript
// El Controller COORDINA Model y respuesta
async function obtenerDenuncias(req, res) {
  try {
    const denuncias = await DenunciaModel.obtenerTodas();
    res.json(denuncias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## 3. Ventajas del Patrón MVC

### ✅ Separación de Responsabilidades

| Sin MVC | Con MVC |
|---------|---------|
| Todo mezclado en un archivo | Cada capa tiene su propósito |
| Difícil de entender | Código organizado y claro |
| Cambios afectan todo | Cambios aislados por capa |

### ✅ Mantenibilidad

- **Fácil de localizar código:** Sabes dónde buscar
- **Cambios aislados:** Modificar UI no afecta la BD
- **Código más limpio:** Funciones pequeñas y enfocadas

### ✅ Reutilización de Código

```javascript
// El mismo Model se usa en múltiples Controllers
DenunciaModel.obtenerTodas()  // En API REST
DenunciaModel.obtenerTodas()  // En reportes
DenunciaModel.obtenerTodas()  // En dashboard
```

### ✅ Facilita el Testing

```javascript
// Testear Model sin Controller
test('DenunciaModel.crear debe insertar en BD', async () => {
  const denuncia = await DenunciaModel.crear(datosPrueba);
  expect(denuncia.id).toBeDefined();
});

// Testear Controller sin BD real
test('Controller debe retornar 500 en error', async () => {
  DenunciaModel.obtenerTodas = jest.fn().mockRejectedValue(new Error());
  const res = await obtenerDenuncias(req, mockRes);
  expect(res.status).toBe(500);
});
```

### ✅ Trabajo en Equipo

- **Frontend:** Trabaja en Views
- **Backend:** Trabaja en Models y Controllers
- **Sin conflictos:** Archivos separados

### ✅ Escalabilidad

```
Proyecto pequeño (100 líneas):    MVC es opcional
Proyecto mediano (500+ líneas):   MVC es recomendable
Proyecto grande (1000+ líneas):   MVC es esencial
```

---

## 4. MVC en Aplicaciones Web Modernas

### Arquitectura Cliente-Servidor

En aplicaciones web modernas con **Frontend separado** (React, Vue, Angular):

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │              VIEW (Componentes React)              │ │
│  │  - ListaDenuncias.jsx                              │ │
│  │  - FormularioDenuncia.jsx                          │ │
│  │  - MapaDenuncias.jsx                               │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Express + PostgreSQL)              │
│  ┌────────────────────────────────────────────────────┐ │
│  │         ROUTES (Endpoints/Rutas)                   │ │
│  │  GET  /api/denuncias                               │ │
│  │  POST /api/denuncias                               │ │
│  └────────────────────────────────────────────────────┘ │
│                            ↕                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │         CONTROLLERS (Lógica de aplicación)         │ │
│  │  - denunciaController.js                           │ │
│  │  - ciudadanoController.js                          │ │
│  └────────────────────────────────────────────────────┘ │
│                            ↕                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │         MODELS (Lógica de datos)                   │ │
│  │  - DenunciaModel.js                                │ │
│  │  - CiudadanoModel.js                               │ │
│  └────────────────────────────────────────────────────┘ │
│                            ↕                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │         DATABASE (PostgreSQL)                      │ │
│  │  - Tablas: denuncias, ciudadanos, autoridades      │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Adaptación de MVC para APIs REST

| Componente Tradicional | En API REST |
|------------------------|-------------|
| **View** | Routes/Endpoints (JSON responses) |
| **Controller** | Controllers (lógica de aplicación) |
| **Model** | Models (acceso a datos) |

---

## 5. Estado Actual del Proyecto

### Arquitectura Actual (Sin MVC)

```
backend/
├── index.js          ← TODO mezclado aquí (99 líneas)
│   ├── Configuración CORS
│   ├── Rutas (GET/POST /api/...)
│   ├── Lógica de negocio
│   └── Queries SQL directas
├── db.js             ← Solo conexión a PostgreSQL
└── package.json
```

### Código Actual: Ejemplo

```javascript
// backend/index.js - TODO EN UN SOLO LUGAR
app.get('/api/denuncias', async (req, res) => {
  try {
    // ❌ Query SQL directa en la ruta
    const result = await pool.query(
      'SELECT id, titulo, descripcion... FROM denuncias...'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener denuncias' });
  }
});
```

### Problemas Identificados

| Problema | Impacto |
|----------|---------|
| **Todo en un archivo** | Difícil de mantener cuando crece |
| **Código duplicado** | Queries similares repetidas |
| **Sin separación** | Cambiar BD afecta rutas |
| **Testing difícil** | No se pueden testear capas por separado |
| **Escalabilidad limitada** | Caótico con más endpoints |

---

## 6. Aplicación de MVC al Sistema de Denuncias

### Análisis del Dominio

**Entidades principales:**
- 👤 Ciudadanos
- 📢 Denuncias
- 👮 Autoridades
- 📋 Asignaciones

**Operaciones comunes:**
- Crear, leer, actualizar, eliminar (CRUD)
- Asignar denuncias a autoridades
- Filtrar por estado, categoría, distrito
- Generar reportes y estadísticas

### Mapeo a MVC

```
📊 DENUNCIAS
├── Model:      DenunciaModel.js      (queries a tabla denuncias)
├── Controller: denunciaController.js (lógica de crear/obtener)
└── Routes:     denunciaRoutes.js     (GET/POST /api/denuncias)

👤 CIUDADANOS
├── Model:      CiudadanoModel.js
├── Controller: ciudadanoController.js
└── Routes:     ciudadanoRoutes.js

👮 AUTORIDADES
├── Model:      AutoridadModel.js
├── Controller: autoridadController.js
└── Routes:     autoridadRoutes.js
```

---

## 7. Estructura Propuesta

### Árbol de Directorios

```
backend/
├── config/
│   └── database.js          ← Configuración de PostgreSQL
├── models/
│   ├── Denuncia.js          ← Model de Denuncias
│   ├── Ciudadano.js         ← Model de Ciudadanos
│   ├── Autoridad.js         ← Model de Autoridades
│   └── Asignacion.js        ← Model de Asignaciones
├── controllers/
│   ├── denunciaController.js    ← Controller de Denuncias
│   ├── ciudadanoController.js   ← Controller de Ciudadanos
│   ├── autoridadController.js   ← Controller de Autoridades
│   └── asignacionController.js  ← Controller de Asignaciones
├── routes/
│   ├── denunciaRoutes.js    ← Rutas de Denuncias
│   ├── ciudadanoRoutes.js   ← Rutas de Ciudadanos
│   ├── autoridadRoutes.js   ← Rutas de Autoridades
│   └── asignacionRoutes.js  ← Rutas de Asignaciones
├── middlewares/
│   ├── errorHandler.js      ← Manejo de errores
│   ├── cors.js              ← Configuración CORS
│   └── validation.js        ← Validación de datos
├── utils/
│   └── helpers.js           ← Funciones auxiliares
├── index.js                 ← Punto de entrada (solo config)
└── package.json
```

### Responsabilidades por Capa

#### **Models (models/)**
- ✅ Queries SQL
- ✅ Validación de datos
- ✅ Transformación de datos
- ✅ Reglas de negocio de datos
- ❌ NO maneja HTTP requests/responses

#### **Controllers (controllers/)**
- ✅ Recibe req, res de Express
- ✅ Llama a Models
- ✅ Maneja errores
- ✅ Formatea respuestas
- ❌ NO contiene SQL directo

#### **Routes (routes/)**
- ✅ Define endpoints (GET, POST, PUT, DELETE)
- ✅ Conecta URLs con Controllers
- ✅ Aplica middlewares
- ❌ NO contiene lógica de negocio

---

## 8. Ejemplos de Implementación

### Ejemplo 1: Módulo de Denuncias

#### **Model: models/Denuncia.js**

```javascript
import pool from '../config/database.js';

export class Denuncia {
  /**
   * Obtener todas las denuncias
   * @returns {Promise<Array>} Lista de denuncias
   */
  static async obtenerTodas() {
    const query = `
      SELECT 
        id, titulo, descripcion, categoria, 
        ubicacion, distrito, estado, fecha_reporte
      FROM denuncias 
      ORDER BY fecha_reporte DESC 
      LIMIT 100
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Obtener denuncia por ID
   * @param {number} id - ID de la denuncia
   * @returns {Promise<Object>} Denuncia encontrada
   */
  static async obtenerPorId(id) {
    const query = 'SELECT * FROM denuncias WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Crear nueva denuncia
   * @param {Object} datos - Datos de la denuncia
   * @returns {Promise<Object>} Denuncia creada
   */
  static async crear(datos) {
    const {
      ciudadano_id, titulo, descripcion, categoria,
      ubicacion, latitud, longitud, distrito, prioridad
    } = datos;

    const query = `
      INSERT INTO denuncias (
        ciudadano_id, titulo, descripcion, categoria,
        ubicacion, latitud, longitud, distrito, prioridad
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      ciudadano_id || null,
      titulo,
      descripcion,
      categoria,
      ubicacion,
      latitud || null,
      longitud || null,
      distrito || null,
      prioridad || 'Media'
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Actualizar estado de denuncia
   * @param {number} id - ID de la denuncia
   * @param {string} nuevoEstado - Nuevo estado
   * @returns {Promise<Object>} Denuncia actualizada
   */
  static async actualizarEstado(id, nuevoEstado) {
    const query = `
      UPDATE denuncias 
      SET estado = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [nuevoEstado, id]);
    return result.rows[0];
  }

  /**
   * Filtrar denuncias por estado
   * @param {string} estado - Estado a filtrar
   * @returns {Promise<Array>} Denuncias filtradas
   */
  static async filtrarPorEstado(estado) {
    const query = `
      SELECT * FROM denuncias 
      WHERE estado = $1 
      ORDER BY fecha_reporte DESC
    `;
    const result = await pool.query(query, [estado]);
    return result.rows;
  }
}
```

#### **Controller: controllers/denunciaController.js**

```javascript
import { Denuncia } from '../models/Denuncia.js';

/**
 * Obtener todas las denuncias
 */
export const obtenerDenuncias = async (req, res) => {
  try {
    const denuncias = await Denuncia.obtenerTodas();
    res.json(denuncias);
  } catch (error) {
    console.error('Error al obtener denuncias:', error);
    res.status(500).json({ 
      error: 'Error al obtener denuncias',
      mensaje: error.message 
    });
  }
};

/**
 * Obtener denuncia por ID
 */
export const obtenerDenuncia = async (req, res) => {
  try {
    const { id } = req.params;
    const denuncia = await Denuncia.obtenerPorId(id);
    
    if (!denuncia) {
      return res.status(404).json({ 
        error: 'Denuncia no encontrada' 
      });
    }
    
    res.json(denuncia);
  } catch (error) {
    console.error('Error al obtener denuncia:', error);
    res.status(500).json({ 
      error: 'Error al obtener denuncia',
      mensaje: error.message 
    });
  }
};

/**
 * Crear nueva denuncia
 */
export const crearDenuncia = async (req, res) => {
  try {
    // Validación básica
    const { titulo, descripcion, categoria, ubicacion } = req.body;
    
    if (!titulo || !descripcion || !categoria || !ubicacion) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos' 
      });
    }

    const nuevaDenuncia = await Denuncia.crear(req.body);
    res.status(201).json(nuevaDenuncia);
  } catch (error) {
    console.error('Error al crear denuncia:', error);
    res.status(500).json({ 
      error: 'Error al crear denuncia',
      mensaje: error.message 
    });
  }
};

/**
 * Actualizar estado de denuncia
 */
export const actualizarEstadoDenuncia = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['Pendiente', 'En Progreso', 'Resuelta', 'Rechazada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        error: 'Estado inválido' 
      });
    }

    const denunciaActualizada = await Denuncia.actualizarEstado(id, estado);
    res.json(denunciaActualizada);
  } catch (error) {
    console.error('Error al actualizar denuncia:', error);
    res.status(500).json({ 
      error: 'Error al actualizar denuncia',
      mensaje: error.message 
    });
  }
};

/**
 * Filtrar denuncias por estado
 */
export const filtrarDenunciasPorEstado = async (req, res) => {
  try {
    const { estado } = req.query;
    const denuncias = await Denuncia.filtrarPorEstado(estado);
    res.json(denuncias);
  } catch (error) {
    console.error('Error al filtrar denuncias:', error);
    res.status(500).json({ 
      error: 'Error al filtrar denuncias',
      mensaje: error.message 
    });
  }
};
```

#### **Routes: routes/denunciaRoutes.js**

```javascript
import express from 'express';
import {
  obtenerDenuncias,
  obtenerDenuncia,
  crearDenuncia,
  actualizarEstadoDenuncia,
  filtrarDenunciasPorEstado
} from '../controllers/denunciaController.js';

const router = express.Router();

// GET /api/denuncias - Obtener todas las denuncias
router.get('/', obtenerDenuncias);

// GET /api/denuncias/:id - Obtener denuncia específica
router.get('/:id', obtenerDenuncia);

// POST /api/denuncias - Crear nueva denuncia
router.post('/', crearDenuncia);

// PUT /api/denuncias/:id/estado - Actualizar estado
router.put('/:id/estado', actualizarEstadoDenuncia);

// GET /api/denuncias/filtrar?estado=Pendiente
router.get('/filtrar', filtrarDenunciasPorEstado);

export default router;
```

#### **index.js (Simplificado)**

```javascript
import express from 'express';
import dotenv from 'dotenv';
import denunciaRoutes from './routes/denunciaRoutes.js';
import ciudadanoRoutes from './routes/ciudadanoRoutes.js';
import autoridadRoutes from './routes/autoridadRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json({ limit: '10mb' }));

// Rutas
app.use('/api/denuncias', denunciaRoutes);
app.use('/api/ciudadanos', ciudadanoRoutes);
app.use('/api/autoridades', autoridadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
```

---

## 9. Flujo de Datos con MVC

### Flujo Completo: Crear una Denuncia

```
1. USUARIO (Frontend)
   └─> Llena formulario y hace clic en "Enviar"
       └─> POST /api/denuncias con JSON

2. ROUTE (denunciaRoutes.js)
   └─> Recibe POST /api/denuncias
       └─> Llama a crearDenuncia() del Controller

3. CONTROLLER (denunciaController.js)
   └─> Valida datos recibidos
       └─> Llama a Denuncia.crear() del Model

4. MODEL (Denuncia.js)
   └─> Ejecuta INSERT en PostgreSQL
       └─> Retorna denuncia creada

5. CONTROLLER
   └─> Recibe denuncia del Model
       └─> Retorna res.status(201).json(denuncia)

6. ROUTE
   └─> Envía respuesta HTTP al cliente

7. USUARIO (Frontend)
   └─> Recibe confirmación y muestra mensaje
```

### Diagrama de Secuencia

```
Frontend          Route           Controller         Model           Database
   |                |                 |                |                |
   |--POST /api/--->|                 |                |                |
   |   denuncias    |                 |                |                |
   |                |--crearDenuncia->|                |                |
   |                |                 |--validar---    |                |
   |                |                 |   datos   |    |                |
   |                |                 |<----------    |                |
   |                |                 |                |                |
   |                |                 |--crear(datos)->|                |
   |                |                 |                |--INSERT INTO-->|
   |                |                 |                |   denuncias    |
   |                |                 |                |<--result-------|
   |                |                 |<--denuncia-----|                |
   |                |<--res.json(d)---|                |                |
   |<--201 Created--|                 |                |                |
   |                |                 |                |                |
```

---

## 10. Conclusiones

### Beneficios de Aplicar MVC al Sistema de Denuncias

#### ✅ Organización
- Código estructurado y fácil de navegar
- Cada archivo tiene una responsabilidad clara
- Nuevos desarrolladores entienden rápido

#### ✅ Mantenibilidad
- Cambios en BD solo afectan Models
- Cambios en lógica solo afectan Controllers
- Cambios en endpoints solo afectan Routes

#### ✅ Escalabilidad
- Fácil agregar nuevas entidades (Comentarios, Notificaciones)
- Estructura soporta crecimiento del proyecto
- Preparado para 27 tablas de la BD

#### ✅ Reutilización
```javascript
// El mismo Model en diferentes contextos
DenunciaModel.obtenerTodas()  // API REST
DenunciaModel.obtenerTodas()  // Generador de reportes
DenunciaModel.obtenerTodas()  // Dashboard admin
```

#### ✅ Testing
```javascript
// Testear cada capa independientemente
test('Model: crear denuncia')
test('Controller: validar datos')
test('Routes: endpoint correcto')
```

### Comparación: Antes vs Después

| Aspecto | Sin MVC (Actual) | Con MVC (Propuesto) |
|---------|------------------|---------------------|
| **Archivos** | 1 archivo (index.js) | 12+ archivos organizados |
| **Líneas por archivo** | 99 líneas | 50-100 líneas promedio |
| **Búsqueda de código** | Buscar en todo index.js | Ir directo al archivo |
| **Agregar endpoint** | Editar index.js (conflictos) | Crear en route específico |
| **Cambiar query** | Buscar en index.js | Editar Model específico |
| **Testing** | Difícil (todo acoplado) | Fácil (capas separadas) |
| **Trabajo en equipo** | Conflictos en Git | Archivos separados |

### Recomendación Final

> **Para el Sistema de Denuncias, implementar MVC es altamente recomendable porque:**
> 
> 1. El proyecto tiene **27 tablas** en la base de datos
> 2. Crecerá con más funcionalidades
> 3. Mejorará la calidad del código
> 4. Facilitará el mantenimiento futuro
> 5. Es un estándar de la industria

---

## 📚 Referencias

- **Patrón MVC:** [Wikipedia - Model-View-Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
- **Express.js Best Practices:** [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- **Node.js Design Patterns:** [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- **RESTful API Design:** [REST API Tutorial](https://restfulapi.net/)

---

## 📊 Anexo: Comparación de Código

### Código Actual (Sin MVC)

```javascript
// backend/index.js - 99 líneas, todo mezclado
app.get('/api/denuncias', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, titulo... FROM denuncias...');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener denuncias' });
  }
});

app.post('/api/denuncias', async (req, res) => {
  try {
    const { ciudadano_id, titulo, descripcion... } = req.body;
    const q = `INSERT INTO denuncias (...) VALUES (...)`;
    const values = [...];
    const result = await pool.query(q, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear denuncia' });
  }
});
```

### Código con MVC (Propuesto)

```javascript
// models/Denuncia.js - Solo datos
export class Denuncia {
  static async obtenerTodas() {
    const result = await pool.query('SELECT...');
    return result.rows;
  }
  
  static async crear(datos) {
    const result = await pool.query('INSERT...');
    return result.rows[0];
  }
}

// controllers/denunciaController.js - Solo lógica
export const obtenerDenuncias = async (req, res) => {
  try {
    const denuncias = await Denuncia.obtenerTodas();
    res.json(denuncias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearDenuncia = async (req, res) => {
  try {
    const denuncia = await Denuncia.crear(req.body);
    res.status(201).json(denuncia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// routes/denunciaRoutes.js - Solo rutas
import { obtenerDenuncias, crearDenuncia } from '../controllers/denunciaController.js';
router.get('/', obtenerDenuncias);
router.post('/', crearDenuncia);

// index.js - Solo configuración
app.use('/api/denuncias', denunciaRoutes);
```

---

**Preparado para:** Exposición sobre Patrón MVC  
**Proyecto:** Sistema de Denuncias Ciudadanas  
**Fecha:** Diciembre 2024
