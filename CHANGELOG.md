# Changelog

Últimos cambios (rama `Full_Components`)

## Commits recientes

- af9057e — refactor(stats): remove geographic distribution map from Estadisticas
  - Eliminó la tarjeta/placeholder del mapa en la vista de Estadísticas.

- 067021b — refactor(authority): remove transit incident map from dashboard
  - Quitó el mapa de incidencias del `AuthorityDashboard` (inicio de autoridad).

- eb9c7f5 — fix(denuncias): improve GoogleMap error handling and loading state
  - Mejor manejo de carga de Google Maps en `Denuncias.jsx` (useJsApiLoader), y mensajes/fallback.

- 09ce68d — feat(denuncias): integrate Google Maps of Cusco with incident markers
  - Integración inicial de Google Maps centrado en Cusco con marcadores de ejemplo.

- 0f8feb4 — fix(authority): graceful fallback when Google Maps fails (useJsApiLoader + OSM iframe)
  - Añadido fallback a OpenStreetMap (iframe) cuando la API Key de Google Maps falta o falla.

- 62a6692 — feat(authority): show Cusco incidents with colored markers
  - Dashboard de autoridad: marcadores de ejemplo en Cusco con colores por tipo.


## Notas

- Si quieres que estos marcadores provengan de la base de datos, puedo conectar la vista a la API y cargar los puntos dinámicamente.
- Para ver Google Maps en local, configura `.env` con `VITE_GOOGLE_MAPS_API_KEY` y reinicia el servidor.
