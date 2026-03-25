import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { generateId, hashPassword } from '../utils/auth.js';
import { getStaff, getStaffById, createStaff, updateStaff, createUser } from '../utils/database.js';

const router = express.Router();

// Get staff
router.get('/', authenticateToken, async (req, res) => {
  const { organizationId, branchId, status } = req.query;

  const filters = {};
  
  if (organizationId) {
    filters.organizationId = organizationId;
  } else if (req.user.role !== 'super_admin') {
    filters.organizationId = req.user.organizationId;
  }

  if (branchId) filters.branchId = branchId;
  if (status) filters.status = status;

  const { data: staff, error } = await getStaff(filters);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch staff' });
  }

  res.json(staff || []);
});

// Get staff by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { data: staff, error } = await getStaffById(req.params.id);

  if (error || !staff) {
    return res.status(404).json({ error: 'Staff not found' });
  }

  if (req.user.organizationId !== staff.organization_id && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json(staff);
});

// Create staff
router.post('/', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { name, email, role, organizationId, branchId } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role required' });
  }

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const staffId = generateId('staff');
  const { data: staff, error } = await createStaff({
    id: staffId,
    name,
    email,
    role,
    organization_id: orgId,
    branch_id: branchId,
    status: 'active',
    created_at: new Date().toISOString(),
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to create staff' });
  }

  res.status(201).json(staff);
});

// Update staff
router.put('/:id', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { id } = req.params;
  const { name, role, branchId, status } = req.body;

  const { data: existingStaff } = await getStaffById(id);

  if (!existingStaff) {
    return res.status(404).json({ error: 'Staff not found' });
  }

  if (req.user.organizationId !== existingStaff.organization_id && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const updates = {};
  if (name) updates.name = name;
  if (role) updates.role = role;
  if (branchId !== undefined) updates.branch_id = branchId;
  if (status) updates.status = status;

  const { data: staff, error } = await updateStaff(id, updates);

  if (error) {
    return res.status(500).json({ error: 'Failed to update staff' });
  }

  res.json(staff);
});

export default router;
