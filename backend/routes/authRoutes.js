import express from 'express';
import { login, resetPasswordsDev } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/reset-passwords-dev', resetPasswordsDev);

export default router;
