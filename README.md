# 🚨 Sistema de Denuncias

Sistema web para la gestión de denuncias ciudadanas con geolocalización y asignación a autoridades.

## 🏗️ Arquitectura

- **Frontend:** React + Vite + React Router
- **Backend:** Express.js + PostgreSQL
- **Mapas:** Google Maps API / Leaflet

## 📁 Estructura del Proyecto

```
SistemaDeDenuncias/SD/
├── backend/              # API REST con Express
├── src/                 # Código fuente React
├── database/            # Scripts SQL
├── docs/                # Documentación
└── public/              # Archivos estáticos
```

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js v18+
- PostgreSQL v12+

### Configuración

**Ver la [Guía de Configuración Completa](./SETUP.md)** para instrucciones detalladas.

Pasos rápidos:

```bash
# 1. Configurar variables de entorno
copy .env.example .env
copy backend\.env.example backend\.env

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Instalar dependencias del frontend
cd ..
npm install

# 4. Iniciar backend (terminal 1)
cd backend
npm run dev

# 5. Iniciar frontend (terminal 2)
npm run dev
```

## 🛠️ Comandos Disponibles

### Frontend
```bash
npm run dev      # Servidor de desarrollo (http://localhost:5173)
npm run build    # Compilar para producción
npm run preview  # Vista previa del build
npm run lint     # Verificar código
```

### Backend
```bash
cd backend
npm run dev      # Servidor con auto-reload (http://localhost:4000)
npm start        # Servidor en producción
```

## 📚 Documentación

- [SETUP.md](./SETUP.md) - Guía completa de configuración
- [CHANGELOG.md](./CHANGELOG.md) - Historial de cambios
- [docs/](./docs/) - Documentación adicional

## 🔧 Tecnologías

- **Frontend:** React 19, React Router, Vite
- **Backend:** Express, PostgreSQL (pg)
- **Mapas:** Google Maps API, Leaflet
- **Estilos:** CSS Vanilla
- **Iconos:** React Icons

## 📝 Características

- ✅ Registro y visualización de denuncias
- ✅ Geolocalización con mapas interactivos
- ✅ Asignación de denuncias a autoridades
- ✅ Gestión de ciudadanos y autoridades
- ✅ Filtrado por categorías y distritos

## 🤝 Contribuir

1. Crea una rama para tu feature
2. Realiza tus cambios
3. Asegúrate de que el código pase el linter
4. Crea un Pull Request

## 🚀 Despliegue

### Opción 1: Despliegue en Vercel + Railway (Producción) ⭐ RECOMENDADO

✅ **Archivos listos:**
- `vercel.json` - Configuración de Vercel
- `Procfile` - Configuración de Railway
- `.env.vercel.example` - Variables para frontend
- `backend/.env.production.example` - Variables para backend

**Pasos rápidos:**
1. Sube tu código a GitHub
2. Despliega backend en [Railway.app](https://railway.app) (incluye PostgreSQL gratis)
3. Despliega frontend en [Vercel.com](https://vercel.com)
4. Configura variables de entorno en ambos

📖 **[Ver Guía Completa de Despliegue en Vercel](./docs/vercel_deployment.md)**

---

### Opción 2: Despliegue Local (Desarrollo)

✅ **Configuración completada:**
- Backend `.env` configurado
- Dependencias instaladas
- Script `init.sql` listo para inicializar la base de datos

**Pasos para Desplegar:**

1. **Inicializar Base de Datos**
   ```bash
   # Opción A: Script automatizado
   cd database
   .\setup.ps1
   
   # Opción B: Manual
   psql -U postgres -c "CREATE DATABASE sistema_denuncias;"
   psql -U postgres -d sistema_denuncias -f database/init.sql
   ```

2. **Iniciar Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

3. **Verificar Frontend** (ya corriendo en Terminal 2)
   ```
   http://localhost:5173
   ```

4. **Verificar Conexión**
   ```bash
   curl http://localhost:4000/api/health
   ```

📖 **[Ver Guía de Despliegue Local](./docs/deployment_guide.md)**

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

**Desarrollado con ❤️ para mejorar la gestión de denuncias ciudadanas**
