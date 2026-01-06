import express from 'express';
import {
    getCiudadanoProfile,
    updateCiudadanoProfile,
    updatePreferences,
    changePassword,
    deleteAccount,
    getCiudadanos,
    searchByDNI
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', getCiudadanos);
router.get('/dni/:dni', searchByDNI);
router.get('/:id', getCiudadanoProfile);
router.put('/:id', updateCiudadanoProfile);
router.put('/:id/preferences', updatePreferences);
router.put('/:id/password', changePassword);
router.delete('/:id', deleteAccount);

export default router;
