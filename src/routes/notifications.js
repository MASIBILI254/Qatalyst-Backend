import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { verifyToken } from '../utils/auth.js';
import { getNotifications, createNotification, updateNotification } from '../utils/database.js';

const router = express.Router();

// Get notifications for current user
router.get('/', authenticateToken,verifyToken, async (req, res) => {
  const { data: notifications, error } = await getNotifications(req.user.id);
  //check if theres token
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }


  if (error) {
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }

  res.json(notifications || []);
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  const { data: notification, error } = await updateNotification(req.params.id, {
    read_at: new Date().toISOString(),
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to update notification' });
  }

  res.json(notification);
});

// Send notification
router.post('/', authenticateToken, async (req, res) => {
  const { userId, title, message, type = 'info' } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({ error: 'UserId, title, and message required' });
  }

  const { data: notification, error } = await createNotification({
    user_id: userId,
    title,
    message,
    type,
    read_at: null,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to send notification' });
  }

  res.status(201).json(notification);
});

export default router;
