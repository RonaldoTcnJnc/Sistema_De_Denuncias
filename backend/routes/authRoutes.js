import express from 'express';
import { login, register, resetPasswordsDev, checkDni } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/reset-passwords-dev', resetPasswordsDev);
router.post('/consulta-dni', checkDni);

export default router;
