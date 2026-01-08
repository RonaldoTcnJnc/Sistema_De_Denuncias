
// En producción (Vercel), VITE_API_URL debe ser la URL del backend en Render.
// En desarrollo, puede ser vacío (para usar el proxy de Vite) o http://localhost:4000
export const BASE_URL = import.meta.env.VITE_API_URL || '/api';
