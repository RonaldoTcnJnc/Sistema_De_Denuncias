# 🚀 Guía de Configuración - Sistema de Denuncias

Esta guía te ayudará a configurar correctamente tu entorno de desarrollo.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- ✅ **PostgreSQL** (v12 o superior) - [Descargar](https://www.postgresql.org/download/)
- ✅ **Git** - [Descargar](https://git-scm.com/)

## 📁 Estructura del Proyecto

```
SistemaDeDenuncias/SD/
├── backend/              # API Express + PostgreSQL
│   ├── .env             # Variables de entorno (NO en Git)
│   ├── .env.example     # Plantilla de variables
│   ├── index.js         # Servidor Express
│   ├── db.js            # Conexión a PostgreSQL
│   └── package.json
├── src/                 # Frontend React
├── public/              # Archivos estáticos
├── .env                 # Variables de entorno frontend (NO en Git)
├── .env.example         # Plantilla de variables
├── vite.config.js       # Configuración de Vite
└── package.json         # Dependencias frontend
```

---

## ⚙️ Configuración Paso a Paso

### 1️⃣ Configurar Base de Datos

#### Crear la base de datos:
```sql
CREATE DATABASE sistema_denuncias;
```

#### Ejecutar el script de inicialización:
```bash
psql -U postgres -d sistema_denuncias -f database/init.sql
```

---

### 2️⃣ Configurar Backend

#### Navegar a la carpeta backend:
```bash
cd backend
```

#### Crear archivo `.env` desde la plantilla:
```bash
copy .env.example .env
```

#### Editar `backend/.env` con tus credenciales:
```env
# Configuración de PostgreSQL
PGUSER=postgres
PGPASSWORD=tu_password_aqui
PGHOST=localhost
PGPORT=5432
PGDATABASE=sistema_denuncias

# Puerto del servidor backend
PORT=4000

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173
```

#### Instalar dependencias:
```bash
npm install
```

#### Iniciar el servidor backend:
```bash
npm run dev
```

✅ **Verificar:** Abre `http://localhost:4000/api/health` - deberías ver `{"ok":true,"time":"..."}`

---

### 3️⃣ Configurar Frontend

#### Volver a la raíz del proyecto:
```bash
cd ..
```

#### Crear archivo `.env` desde la plantilla:
```bash
copy .env.example .env
```

#### Editar `.env` con tu API Key de Google Maps:
```env
# Google Maps API Key
# Obtén tu clave en: https://console.cloud.google.com/
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD...TU_API_KEY_AQUI...

# URL del backend (opcional si usas proxy)
VITE_API_URL=http://localhost:4000
```

> [!TIP]
> **¿Cómo obtener una API Key de Google Maps?**
> 1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
> 2. Crea un proyecto nuevo
> 3. Habilita "Maps JavaScript API"
> 4. Ve a "Credenciales" → "Crear credenciales" → "Clave de API"
> 5. Copia la clave generada

#### Instalar dependencias:
```bash
npm install
```

#### Iniciar el servidor de desarrollo:
```bash
npm run dev
```

✅ **Verificar:** Abre `http://localhost:5173` - deberías ver la aplicación funcionando

---

## 🔧 Configuración Avanzada

### ✅ Proxy en Vite (Ya Configurado)

El proyecto ya tiene configurado un proxy en `vite.config.js` que redirige automáticamente las peticiones `/api/*` al backend en `http://localhost:4000`.

**Ventaja:** Puedes hacer peticiones a `/api/denuncias` en lugar de `http://localhost:4000/api/denuncias`

### ✅ CORS en Backend (Ya Configurado)

El backend ya tiene CORS configurado para aceptar peticiones desde `http://localhost:5173` sin necesidad de instalar dependencias adicionales.

---

## 🚀 Comandos Útiles

### Backend
```bash
cd backend
npm run dev      # Iniciar con nodemon (auto-reload)
npm start        # Iniciar en producción
```

### Frontend
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Vista previa de build
npm run lint     # Verificar código con ESLint
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Cannot connect to database"
**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Revisa las credenciales en `backend/.env`
3. Confirma que la base de datos `sistema_denuncias` existe

### ❌ Error: "CORS policy blocked"
**Solución:**
El CORS ya está configurado. Si aún ves este error:
1. Verifica que el backend esté corriendo en el puerto 4000
2. Asegúrate de que `FRONTEND_URL` en `backend/.env` sea `http://localhost:5173`
3. Reinicia ambos servidores

### ❌ Error: "Google Maps API key invalid"
**Solución:**
1. Verifica que la API Key esté correcta en `.env`
2. Asegúrate de que "Maps JavaScript API" esté habilitada en Google Cloud
3. Revisa las restricciones de la API Key

### ❌ Error: "Port 4000 already in use"
**Solución:**
1. Cambia el puerto en `backend/.env`: `PORT=4001`
2. O detén el proceso que está usando el puerto 4000

---

## 📝 Notas Importantes

> [!WARNING]
> **Nunca subas archivos `.env` a Git**
> - Los archivos `.env` contienen información sensible (contraseñas, API keys)
> - Ya están incluidos en `.gitignore`
> - Solo comparte archivos `.env.example`

> [!IMPORTANT]
> **Desarrollo vs Producción**
> - Esta configuración es para **desarrollo local**
> - Para producción, necesitarás configurar variables de entorno en tu servidor
> - Considera usar servicios como Vercel, Railway o Render para deployment

---

## 🎯 Próximos Pasos

Una vez configurado el entorno:

1. ✅ Verifica que backend y frontend funcionan
2. ✅ Prueba crear una denuncia desde la interfaz
3. ✅ Revisa la consola del navegador para errores
4. ✅ Familiarízate con la estructura del código

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas con la configuración, revisa:
- Los logs del backend en la terminal
- La consola del navegador (F12)
- Los archivos de documentación en `/docs`

¡Listo! Tu entorno de desarrollo está configurado 🎉
