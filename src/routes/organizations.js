import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { generateId } from '../utils/auth.js';
import { getOrganizations, getOrganizationById, createOrganization, updateOrganization } from '../utils/database.js';

const router = express.Router();

// Get all organizations (Super Admin only)
router.get('/', authenticateToken, authorize('super_admin'), async (req, res) => {
  const { data: organizations, error } = await getOrganizations();

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch organizations' });
  }

  res.json(organizations || []);
});

// Get organization by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { data: organization, error } = await getOrganizationById(req.params.id);

  if (error || !organization) {
    return res.status(404).json({ error: 'Organization not found' });
  }

  // Check authorization
  if (req.user.organizationId !== req.params.id && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json(organization);
});

// Create organization (Super Admin only)
router.post('/', authenticateToken, authorize('super_admin'), async (req, res) => {
  const { name, slug, tier = 'basic' } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug required' });
  }

  const orgId = generateId('org');
  const { data: organization, error } = await createOrganization({
    id: orgId,
    name,
    slug,
    tier,
    status: 'active',
    created_at: new Date().toISOString(),
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to create organization' });
  }

  res.status(201).json(organization);
});

// Update organization
router.put('/:id', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { id } = req.params;
  const { name, tier, status } = req.body;

  // Check authorization
  if (req.user.organizationId !== id && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const updates = {};
  if (name) updates.name = name;
  if (tier) updates.tier = tier;
  if (status) updates.status = status;

  const { data: organization, error } = await updateOrganization(id, updates);

  if (error) {
    return res.status(500).json({ error: 'Failed to update organization' });
  }

  res.json(organization);
});

export default router;
