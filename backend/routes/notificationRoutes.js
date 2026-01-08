import express from 'express';
import { getNotifications, markRead, markAllRead } from '../controllers/notificationController.js';

const router = express.Router();

// GET /api/notificaciones/:id (id of citizen)
router.get('/:id', getNotifications);

// PUT /api/notificaciones/:id/read (id of notification)
router.put('/:id/read', markRead);

// PUT /api/notificaciones/read-all
router.put('/read-all', markAllRead);

export default router;
