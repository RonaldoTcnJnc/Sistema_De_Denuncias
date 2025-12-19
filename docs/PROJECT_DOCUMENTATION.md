# Documentación del Proyecto — SistemaDeDenuncias


Este documento amplía el README con detalles de arquitectura, rutas, componentes clave, decisiones técnicas y recomendaciones para seguir desarrollando.

1) Objetivo del proyecto
- Interfaz ciudadana para reportar incidencias y un panel para autoridades gestionar reportes.

2) Stack y dependencias
- Frontend: React + Vite
- Iconos: `react-icons` (Feather)
- (Recomendado) Mapas: `leaflet` + `react-leaflet` (no integrado por defecto)
- (Recomendado) Charts: `recharts` o `chart.js` para gráficos interactivos

3) Estructura y rutas principales
- `src/App.jsx` — define rutas. Rutas principales añadidas para autoridad:
  - `/iniciar-sesion-autoridad` — login demo
  - `/panel-autoridad` — dashboard autoridad
  - `/denuncias` — lista de denuncias (autoridad)
  - `/estadisticas` — estadísticas (autoridad)
  - `/usuarios` — gestión de usuarios (autoridad)
  - `/perfil-autoridad` — perfil de autoridad

4) Componentes clave
- `HomePage` — landing, hero y `process-section` (tres pasos horizontales)
- `Sidebar` — sidebar principal con logout (limpia storage + redirect `/`)
- `Authority/*` — carpeta con componentes de autoridad (layout, sidebar, dashboard, denuncias, estadisticas, usuarios, perfil, login demo)

5) Datos y mockups
- Muchas páginas usan datos de ejemplo (arrays en componentes) para simular tablas y tarjetas.
- `Denuncias` incluye filtros, badges de estado y una tabla que itera sobre datos mock.

6) Styling
- Estilos organizados por componente en archivos `.css` junto a cada componente.
- Variables CSS globales (ej. `--primary-color`, `--text-color`) usadas para coherencia.

7) Integraciones futuras (recomendadas)
- Mapas con Leaflet: instalar `leaflet` y `react-leaflet`, añadir tiles de OpenStreetMap.
- Gráficos interactivos con `recharts` o `chart.js` para reemplazar SVGs estáticos.
- Autenticación: proteger rutas de autoridad con guards y un backend (JWT, OAuth o sesión).

8) Testing y CI
- No hay tests automatizados en el repo actualmente. Recomendado:
  - Añadir `jest` + `react-testing-library` para componentes críticos.
  - Configurar CI (GitHub Actions) para lint, build y tests en PRs.

9) Flujo Git recomendado
- Rama base de trabajo: `Full_Components` (actualmente usada).
- Para features: `feature/<nombre>`; para correcciones: `fix/<nombre>`.

10) Troubleshooting — problemas comunes
- Error al ejecutar `npm run dev` (Exit Code 1): revisar la salida del terminal, asegurar dependencias instaladas y que no haya imports con rutas rotas.
- Errores de JSX: revisar consola de compilación, normalmente se deben a etiquetas mal cerradas o imports faltantes.

11) Lista de archivos importantes
- `src/components/HomePage/HomePage.jsx`, `HomePage.css`
- `src/components/Sidebar/Sidebar.jsx`
- `src/components/Authority/*` (varios componentes)

12) Cómo colaborar
- Hacer fork o crear rama desde `Full_Components`.
- Abrir PR con descripción, capturas y pasos para probar.


