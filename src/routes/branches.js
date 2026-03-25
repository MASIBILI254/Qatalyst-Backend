import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { generateId } from '../utils/auth.js';
import { getBranches, getBranchById, createBranch, updateBranch } from '../utils/database.js';

const router = express.Router();

// Get branches for organization
router.get('/', authenticateToken, async (req, res) => {
  const { organizationId } = req.query;

  if (!organizationId && req.user.role !== 'super_admin') {
    return res.status(400).json({ error: 'organizationId required' });
  }

  const orgId = organizationId || req.user.organizationId;

  const { data: branches, error } = await getBranches(orgId);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch branches' });
  }

  res.json(branches || []);
});

// Get branch by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { data: branch, error } = await getBranchById(req.params.id);

  if (error || !branch) {
    return res.status(404).json({ error: 'Branch not found' });
  }

  if (req.user.organizationId !== branch.organization_id && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json(branch);
});

// Create branch
router.post('/', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { name, location, organizationId } = req.body;

  if (!name || !location) {
    return res.status(400).json({ error: 'Name and location required' });
  }

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const branchId = generateId('br');
  const { data: branch, error } = await createBranch({
    id: branchId,
    name,
    location,
    organization_id: orgId,
    status: 'active',
    created_at: new Date().toISOString(),
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to create branch' });
  }

  res.status(201).json(branch);
});

// Update branch
router.put('/:id', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { id } = req.params;
  const { name, location, status } = req.body;

  const { data: existingBranch } = await getBranchById(id);

  if (!existingBranch) {
    return res.status(404).json({ error: 'Branch not found' });
  }

  if (req.user.organizationId !== existingBranch.organization_id && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const updates = {};
  if (name) updates.name = name;
  if (location) updates.location = location;
  if (status) updates.status = status;

  const { data: branch, error } = await updateBranch(id, updates);

  if (error) {
    return res.status(500).json({ error: 'Failed to update branch' });
  }

  res.json(branch);
});

export default router;
