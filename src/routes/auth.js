import express from 'express';
import { generateToken, hashPassword, comparePassword, generateId,verifyToken } from '../utils/auth.js';
import { getUserByEmail, createUser, updateUser } from '../utils/database.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const { data: user, error } = await getUserByEmail(email);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    organizationId: user.organization_id,
  });

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organization_id,
    organizationName: user.organization_name,
    avatar: user.avatar,
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at,
  };

  res.json({ message: 'Login successful', token });
});

// Register
router.post('/register', async (req, res) => {
  const { email, password, name, role = 'staff', organizationId } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  const { data: existingUser } = await getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const passwordHash = await hashPassword(password);
  const userId = generateId('usr');

  const { data: user, error } = await createUser({
    id: userId,
    email,
    name,
    role,
    organization_id: organizationId,
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
  });

  if (error) {
     console.log('Error creating user:', error);
    return res.status(500).json({ error: 'Failed to create user' });
   
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    organizationId: user.organization_id,
  });
verifyToken(token);
  res.status(201).json({"user registered successfully": true});
});

// Logout (client-side, but endpoint for audit logging)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
