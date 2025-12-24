import express from 'express';
import {
    getDenuncias,
    getDenunciasByCiudadano,
    createDenuncia,
    updateDenunciaStatus,
    assignDenuncia
} from '../controllers/denunciaController.js';

const router = express.Router();

router.get('/', getDenuncias);
router.get('/ciudadano/:id', getDenunciasByCiudadano);
router.post('/', createDenuncia);
router.put('/:id', updateDenunciaStatus);

// Moved from /api/asignar to /api/denuncias/asignar for better grouping
router.post('/asignar', assignDenuncia);

export default router;
