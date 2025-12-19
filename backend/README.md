# Backend - Sistema de Denuncias

Pequeño backend en Node.js + Express que expone endpoints básicos para la aplicación frontend.

Requisitos:
- Node.js 16+
- PostgreSQL corriendo y la base de datos creada (ver `../database`)

Cómo usar:

1. Copia `.env.example` a `.env` y ajusta credenciales.

2. Instala dependencias:

```powershell
cd backend
npm install
```

3. Ejecuta en modo desarrollo:

```powershell
npm run dev
```

Endpoints disponibles:
- `GET /api/health` — chequear estado
- `GET /api/denuncias` — listar denuncias
- `POST /api/denuncias` — crear denuncia (body JSON)
- `GET /api/ciudadanos` — listar ciudadanos
- `GET /api/autoridades` — listar autoridades
- `POST /api/asignar` — asignar denuncia a autoridad

Ejemplo para crear denuncia (curl):

```bash
curl -X POST http://localhost:4000/api/denuncias \
  -H 'Content-Type: application/json' \
  -d '{"ciudadano_id":1,"titulo":"Ejemplo","descripcion":"Prueba","categoria":"Vialidad","ubicacion":"Calle X"}'
```
