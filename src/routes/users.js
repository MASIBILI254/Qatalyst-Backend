import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { getUserById, updateUser, getStaff } from '../utils/database.js';

const router = express.Router();

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  const { data: user, error } = await getUserById(req.user.id);

  if (error || !user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organization_id,
    organizationName: user.organization_name,
    avatar: user.avatar,
  });
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, avatar } = req.body;

  if (req.user.id !== id && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const updates = {};
  if (name) updates.name = name;
  if (avatar) updates.avatar = avatar;

  const { data: user, error } = await updateUser(id, updates);

  if (error) {
    return res.status(500).json({ error: 'Failed to update user' });
  }

  res.json(user);
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { data: user, error } = await getUserById(req.params.id);

  if (error || !user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

export default router;
