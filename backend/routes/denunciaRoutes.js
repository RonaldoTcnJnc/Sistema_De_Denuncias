import express from 'express';
import {
    getDenuncias,
    getDenunciasByCiudadano,
    createDenuncia,
    updateDenunciaStatus,
    assignDenuncia,
    trackDenuncia,
    createAnonymousDenuncia,
    createAnonymousDenuncia,
    checkDenuncias,
    getEstadisticas
} from '../controllers/denunciaController.js';

const router = express.Router();

router.get('/estadisticas', getEstadisticas);
router.get('/', getDenuncias);
router.get('/verificar', checkDenuncias); // New verification endpoint
router.get('/track/:id', trackDenuncia); // Public tracking endpoint
router.get('/ciudadano/:id', getDenunciasByCiudadano);
router.post('/', createDenuncia);
router.post('/anonimas', createAnonymousDenuncia); // Anonymous report creation
router.put('/:id', updateDenunciaStatus);

// Moved from /api/asignar to /api/denuncias/asignar for better grouping
router.post('/asignar', assignDenuncia);

export default router;
