# 🚀 Guía de Despliegue - Sistema de Denuncias

## Estado Actual del Sistema

✅ **Completado:**
- Archivo `backend/.env` creado con credenciales de PostgreSQL
- Dependencias del backend instaladas
- Script `init.sql` creado (combina schema + datos de ejemplo + stored procedure)
- Frontend corriendo en `http://localhost:5173`

⚠️ **Pendiente:**
- Inicializar base de datos PostgreSQL
- Iniciar servidor backend
- Verificar conexión entre frontend y backend

---

## 📋 Pasos para Despliegue

### Paso 1: Verificar PostgreSQL

Asegúrate de que PostgreSQL esté corriendo:

```powershell
# Verificar servicio de PostgreSQL
Get-Service -Name postgresql*
```

Si no está corriendo, inícialo desde Servicios de Windows o:

```powershell
Start-Service postgresql-x64-18
```

### Paso 2: Configurar Contraseña de PostgreSQL

El archivo `backend/.env` tiene la contraseña `224874`. Si esta no es tu contraseña de PostgreSQL:

1. Abre `backend/.env`
2. Cambia el valor de `PGPASSWORD` a tu contraseña real
3. Guarda el archivo

### Paso 3: Crear e Inicializar la Base de Datos

Abre una terminal en la raíz del proyecto y ejecuta:

```powershell
# Navegar a la carpeta del proyecto
cd c:\Users\USER\Documents\SistemaDeDenuncias\SD

# Crear la base de datos (si no existe)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE sistema_denuncias;"

# Inicializar schema y datos
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d sistema_denuncias -f database\init.sql
```

> [!TIP]
> Si te pide contraseña, ingresa tu contraseña de PostgreSQL.

### Paso 4: Verificar que la Base de Datos se Creó Correctamente

```powershell
# Verificar tablas creadas
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d sistema_denuncias -c "\dt"

# Verificar datos de ejemplo
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d sistema_denuncias -c "SELECT COUNT(*) FROM ciudadanos;"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d sistema_denuncias -c "SELECT COUNT(*) FROM denuncias;"
```

**Resultado esperado:**
- Deberías ver 23 tablas
- 5 ciudadanos
- 5 denuncias

### Paso 5: Iniciar el Servidor Backend

Abre una **nueva terminal** y ejecuta:

```powershell
cd c:\Users\USER\Documents\SistemaDeDenuncias\SD\backend
npm run dev
```

**Resultado esperado:**
```
Backend escuchando en http://localhost:4000
```

### Paso 6: Verificar el Backend

En otra terminal o navegador:

```powershell
# Verificar endpoint de salud
curl http://localhost:4000/api/health

# O en el navegador:
# http://localhost:4000/api/health
```

**Resultado esperado:**
```json
{"ok":true,"time":"2025-12-18T..."}
```

### Paso 7: Verificar el Frontend

El frontend ya está corriendo en `http://localhost:5173`. Abre tu navegador y verifica:

1. La página principal carga correctamente
2. No hay errores en la consola del navegador (F12)
3. Puedes navegar entre páginas

---

## 🧪 Pruebas de Integración

### Probar API de Denuncias

```powershell
# Obtener todas las denuncias
curl http://localhost:4000/api/denuncias

# Obtener ciudadanos
curl http://localhost:4000/api/ciudadanos

# Obtener autoridades
curl http://localhost:4000/api/autoridades
```

### Probar desde el Frontend

1. Abre `http://localhost:5173`
2. Navega a las diferentes secciones
3. Verifica que los datos se cargan correctamente
4. Revisa la consola del navegador (F12) → pestaña Network
5. Deberías ver llamadas exitosas a `/api/*`

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to database"

**Causa:** PostgreSQL no está corriendo o las credenciales son incorrectas

**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Revisa `backend/.env` y confirma que `PGPASSWORD` es correcta
3. Reinicia el servidor backend

### Error: "Port 4000 already in use"

**Causa:** Ya hay un proceso usando el puerto 4000

**Solución:**
```powershell
# Encontrar el proceso
Get-NetTCPConnection -LocalPort 4000 | Select-Object OwningProcess
# Detenerlo si es necesario
Stop-Process -Id <PID>
```

### Error: "CORS policy blocked"

**Causa:** El backend no está corriendo o hay un problema de configuración

**Solución:**
1. Asegúrate de que el backend esté corriendo en puerto 4000
2. Verifica que `FRONTEND_URL` en `backend/.env` sea `http://localhost:5173`
3. Reinicia ambos servidores

### La base de datos no se crea

**Causa:** Problemas de autenticación con PostgreSQL

**Solución:**
1. Intenta conectarte manualmente con pgAdmin
2. Verifica tu contraseña de PostgreSQL
3. Actualiza `backend/.env` con la contraseña correcta

---

## 📊 Verificación Final

Antes de considerar el sistema listo para despliegue, verifica:

- [ ] PostgreSQL corriendo y base de datos `sistema_denuncias` creada
- [ ] 23 tablas creadas en la base de datos
- [ ] Datos de ejemplo cargados (5 ciudadanos, 5 denuncias)
- [ ] Backend corriendo en `http://localhost:4000`
- [ ] Endpoint `/api/health` responde correctamente
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] No hay errores en la consola del navegador
- [ ] Las llamadas API desde el frontend funcionan

---

## 🎯 Próximos Pasos

Una vez que todo esté funcionando localmente:

1. **Configurar Google Maps API Key** (opcional)
   - Obtén una clave en [Google Cloud Console](https://console.cloud.google.com/)
   - Actualiza `VITE_GOOGLE_MAPS_API_KEY` en el archivo `.env` raíz

2. **Preparar para Producción**
   - Considera usar servicios como Railway, Render, o Vercel
   - Configura variables de entorno en tu plataforma de hosting
   - Ejecuta `npm run build` para crear el bundle de producción

3. **Seguridad**
   - Cambia todas las contraseñas de ejemplo
   - Implementa autenticación real (JWT, OAuth, etc.)
   - Configura HTTPS/SSL en producción

---

## 📞 Comandos Rápidos

```powershell
# Iniciar todo el sistema (requiere 3 terminales)

# Terminal 1: Backend
cd c:\Users\USER\Documents\SistemaDeDenuncias\SD\backend
npm run dev

# Terminal 2: Frontend (ya está corriendo)
# http://localhost:5173

# Terminal 3: Verificación
curl http://localhost:4000/api/health
curl http://localhost:4000/api/denuncias
```

¡Tu sistema está listo para funcionar! 🎉
