# 🚀 Guía de Despliegue en Vercel + Railway

## 📋 Resumen

Esta guía te ayudará a desplegar tu Sistema de Denuncias en producción usando:
- **Vercel** para el frontend (React + Vite) - GRATIS
- **Railway** para el backend (Express + PostgreSQL) - GRATIS ($5 crédito mensual)

---

## ✅ Archivos Preparados

Ya están listos estos archivos de configuración:
- ✅ `vercel.json` - Configuración de Vercel
- ✅ `Procfile` - Configuración de Railway
- ✅ `.env.vercel.example` - Variables de entorno para frontend
- ✅ `backend/.env.production.example` - Variables de entorno para backend
- ✅ `database/init.sql` - Script de inicialización de base de datos

---

## 🎯 Paso 1: Preparar el Repositorio en GitHub

### 1.1 Crear Repositorio

```powershell
# Inicializar Git (si no lo has hecho)
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Preparar para despliegue en Vercel + Railway"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/tu-usuario/sistema-denuncias.git
git branch -M main
git push -u origin main
```

### 1.2 Verificar .gitignore

Asegúrate de que `.gitignore` incluya:
```
node_modules/
.env
.env.local
dist/
backend/.env
```

---

## 🚂 Paso 2: Desplegar Backend en Railway

### 2.1 Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en "Start a New Project"
3. Conecta tu cuenta de GitHub

### 2.2 Crear Proyecto

1. Selecciona "Deploy from GitHub repo"
2. Busca y selecciona tu repositorio `sistema-denuncias`
3. Railway detectará automáticamente que es un proyecto Node.js

### 2.3 Agregar PostgreSQL

1. En tu proyecto de Railway, haz clic en "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente la base de datos

### 2.4 Configurar Variables de Entorno

En el dashboard de Railway, ve a tu servicio backend → "Variables":

```env
# Railway genera automáticamente estas variables cuando agregas PostgreSQL:
# DATABASE_URL (Railway la crea automáticamente)

# Agrega manualmente estas:
PORT=4000
FRONTEND_URL=https://tu-app.vercel.app
NODE_ENV=production
```

> [!TIP]
> Railway automáticamente configura `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, y `PGDATABASE` cuando conectas PostgreSQL. También puedes usar la variable `DATABASE_URL` directamente.

### 2.5 Configurar Build

En "Settings" → "Build":
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: `/` (raíz del proyecto)

O simplemente Railway usará el `Procfile` que ya creamos.

### 2.6 Inicializar Base de Datos

Una vez desplegado, necesitas ejecutar el script `init.sql`:

**Opción A - Desde Railway CLI:**
```powershell
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Conectar a PostgreSQL y ejecutar script
railway run psql $DATABASE_URL -f database/init.sql
```

**Opción B - Desde el Dashboard:**
1. Ve a PostgreSQL en Railway
2. Haz clic en "Data" → "Query"
3. Copia y pega el contenido de `database/init.sql`
4. Ejecuta el query

### 2.7 Obtener URL del Backend

Railway te dará una URL como: `https://sistema-denuncias-production.up.railway.app`

**¡Guarda esta URL!** La necesitarás para el frontend.

---

## ☁️ Paso 3: Desplegar Frontend en Vercel

### 3.1 Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Conecta tu cuenta de GitHub

### 3.2 Importar Proyecto

1. Haz clic en "Add New..." → "Project"
2. Selecciona tu repositorio `sistema-denuncias`
3. Vercel detectará automáticamente que es un proyecto Vite

### 3.3 Configurar Build Settings

Vercel debería detectar automáticamente:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Si no, configúralos manualmente.

### 3.4 Configurar Variables de Entorno

En "Environment Variables", agrega:

```env
VITE_API_URL=https://tu-backend.railway.app
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_opcional
```

> [!IMPORTANT]
> Reemplaza `https://tu-backend.railway.app` con la URL real que obtuviste de Railway en el Paso 2.7

### 3.5 Desplegar

1. Haz clic en "Deploy"
2. Vercel construirá y desplegará tu aplicación
3. Obtendrás una URL como: `https://sistema-denuncias.vercel.app`

---

## 🔄 Paso 4: Conectar Frontend y Backend

### 4.1 Actualizar CORS en Backend

Edita `backend/index.js` y asegúrate de que la URL de Vercel esté en la lista de orígenes permitidos:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://sistema-denuncias.vercel.app', // Tu URL de Vercel
  process.env.FRONTEND_URL
].filter(Boolean);
```

Haz commit y push:
```powershell
git add backend/index.js
git commit -m "Agregar URL de Vercel a CORS"
git push
```

Railway redesplegará automáticamente.

### 4.2 Actualizar Variable en Railway

Ve a Railway → Variables y actualiza:
```env
FRONTEND_URL=https://sistema-denuncias.vercel.app
```

---

## ✅ Paso 5: Verificar Despliegue

### 5.1 Verificar Backend

Abre en tu navegador:
```
https://tu-backend.railway.app/api/health
```

Deberías ver:
```json
{"ok":true,"time":"2025-12-18T..."}
```

### 5.2 Verificar Base de Datos

```
https://tu-backend.railway.app/api/denuncias
```

Deberías ver un array JSON con las denuncias de ejemplo.

### 5.3 Verificar Frontend

Abre tu app en Vercel:
```
https://sistema-denuncias.vercel.app
```

1. La página debe cargar correctamente
2. Abre DevTools (F12) → Console (no debe haber errores)
3. Ve a Network → intenta navegar por la app
4. Las llamadas a `/api/*` deben ser exitosas (status 200)

---

## 🔧 Solución de Problemas

### Error: "CORS policy blocked"

**Solución:**
1. Verifica que `FRONTEND_URL` en Railway sea correcta
2. Asegúrate de que la URL de Vercel esté en `allowedOrigins` en `backend/index.js`
3. Redespliega el backend

### Error: "Cannot connect to database"

**Solución:**
1. Verifica que PostgreSQL esté corriendo en Railway
2. Verifica que `init.sql` se haya ejecutado correctamente
3. Revisa los logs en Railway Dashboard

### Error: "API calls return 404"

**Solución:**
1. Verifica que `VITE_API_URL` en Vercel apunte a la URL correcta de Railway
2. Asegúrate de que el backend esté desplegado y corriendo
3. Verifica que la URL no tenga `/` al final

### Frontend carga pero no muestra datos

**Solución:**
1. Abre DevTools → Network
2. Verifica que las llamadas API se estén haciendo
3. Revisa si hay errores CORS
4. Verifica que `VITE_API_URL` esté configurada correctamente

---

## 🔄 Actualizaciones Futuras

### Actualizar Frontend

```powershell
git add .
git commit -m "Actualización del frontend"
git push
```

Vercel redesplegará automáticamente.

### Actualizar Backend

```powershell
git add .
git commit -m "Actualización del backend"
git push
```

Railway redesplegará automáticamente.

---

## 💰 Costos y Límites

### Vercel (Plan Hobby - Gratis)
- ✅ 100 GB bandwidth/mes
- ✅ Despliegues ilimitados
- ✅ SSL automático
- ✅ Dominio personalizado

### Railway (Plan Trial - Gratis)
- ✅ $5 USD de crédito mensual
- ✅ ~500 horas de ejecución
- ✅ PostgreSQL incluido
- ✅ 1 GB de almacenamiento

> [!NOTE]
> Con uso moderado, el plan gratuito de Railway debería ser suficiente. Si se agota, considera:
> - Render (gratis pero el servicio "duerme")
> - Actualizar a plan de pago de Railway ($5/mes)

---

## 📊 Checklist Final

- [ ] Repositorio en GitHub creado y actualizado
- [ ] Backend desplegado en Railway
- [ ] PostgreSQL agregado en Railway
- [ ] Base de datos inicializada con `init.sql`
- [ ] Variables de entorno configuradas en Railway
- [ ] Frontend desplegado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] CORS actualizado con URL de Vercel
- [ ] `/api/health` responde correctamente
- [ ] `/api/denuncias` retorna datos
- [ ] Frontend carga sin errores
- [ ] API calls funcionan desde el frontend

---

## 🎉 ¡Listo!

Tu Sistema de Denuncias está ahora desplegado en producción:

- **Frontend**: `https://sistema-denuncias.vercel.app`
- **Backend**: `https://sistema-denuncias-production.up.railway.app`

Comparte la URL de Vercel con tus usuarios. 🚀
