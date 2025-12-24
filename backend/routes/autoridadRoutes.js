import express from 'express';
import { getAutoridades } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', getAutoridades);

export default router;
