# 🚀 Despliegue en Render + Vercel (Opción Gratuita)

Esta guía te permite desplegar tu backend y base de datos **gratis** en Render, y tu frontend en Vercel.

---

## 🏗️ Parte 1: Base de Datos y Backend en Render

### 1.1 Crear Cuenta
Ve a [dashboard.render.com](https://dashboard.render.com/) y crea una cuenta (puedes usar GitHub).

### 1.2 Crear Base de Datos PostgreSQL
1. Haz clic en **New +** y selecciona **PostgreSQL**.
2. **Name:** `sistemadenuncias-db`
3. **Region:** Elige la más cercana (ej: Ohio o Frankfurt).
4. **PostgreSQL Version:** 15 o 16 (la que salga por defecto).
5. **Instance Type:** Select **Free** (abajo del todo).
6. Haz clic en **Create Database**.
7. ⚠️ **IMPORTANTE:** Cuando se cree, copia la **"Internal Database URL"**. Gúardala, la necesitaremos en el paso 1.3.

### 1.3 Crear Backend Web Service
1. Haz clic en **New +** y selecciona **Web Service**.
2. Conecta tu repositorio de GitHub `SistemadeDenuncias`.
3. **Name:** `sistemadenuncias-backend`.
4. **Region:** La misma que tu base de datos.
5. **Runtime:** Node.
6. **Build Command:** `cd backend && npm install`
7. **Start Command:** `cd backend && npm start`
8. **Instance Type:** Select **Free**.
9. **Environment Variables** (Botón "Advanced" o abajo):
   Haz clic en "Add Environment Variable" para cada una:
   
   | Variable | Valor |
   |----------|-------|
   | `DATABASE_URL` | (Pega la URL de la base de datos que copiaste) |
   | `PORT` | `10000` |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | `https://sistema-denuncias.vercel.app` (o pon `*` por ahora) |

10. Haz clic en **Create Web Service**.

### 1.4 Inicializar Tablas en la Base de Datos
Render no tiene una consola SQL integrada fácil como Railway. Para crear tus tablas:

**Opción A (Recomendada): Usar script local si tienes PostgreSQL instalado**
En tu terminal local:
```powershell
# Reemplaza la URL con la 'External Database URL' de Render (no la Internal)
psql "pegue-aqui-external-database-url" -f database/init.sql
```

**Opción B (Si no tienes PostgreSQL local):**
Debes conectarte usando alguna herramienta como DBeaver, pgAdmin, o TablePlus usando la **External Database URL**.

---

## 🌐 Parte 2: Frontend en Vercel

### 2.1 Crear Proyecto
1. Ve a [vercel.com/new](https://vercel.com/new).
2. Importa tu repositorio `SistemadeDenuncias`.

### 2.2 Configurar Build
1. **Framework Preset:** Vite (lo detecta solo).
2. **Root Directory:** ⚠️ **CÁMBIALO a `. /` (la raíz)** (No uses `src`).

### 2.3 Variables de Entorno
Agrega esta variable antes de desplegar:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://tu-nombre-backend.onrender.com` |

*(Obtén la URL de tu backend en el dashboard de Render, arriba a la izquierda debajo del nombre)*.

3. Haz clic en **Deploy**.

---

## 🔗 Parte 3: Conectar Todo

1. Una vez desplegado Vercel, copia la URL final (ej: `https://sistema-denuncias.vercel.app`).
2. Ve a Render -> Dashboard -> Tu Backend -> Environment.
3. Edita la variable `FRONTEND_URL` y pon la URL de Vercel (sin `/` al final).
4. Guarda cambios (Render redeplegará automáticamente).

¡Listo! 🎉
