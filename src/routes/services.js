import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { generateId } from '../utils/auth.js';
import { getServices, createService, updateService, deleteService } from '../utils/database.js';

const router = express.Router();

// Get services for organization
router.get('/', authenticateToken, async (req, res) => {
  const { organizationId } = req.query;

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { data: services, error } = await getServices(orgId);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch services' });
  }

  res.json(services || []);
});

// Create service
router.post('/', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { name, description, estimatedTime, organizationId } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const serviceId = generateId('svc');
  const { data: service, error } = await createService({
    id: serviceId,
    name,
    description,
    estimated_time: estimatedTime || 15,
    organization_id: orgId,
    status: 'active',
    created_at: new Date().toISOString(),
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to create service' });
  }

  res.status(201).json(service);
});

// Update service
router.put('/:id', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { id } = req.params;
  const { name, description, estimatedTime, status } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (description) updates.description = description;
  if (estimatedTime) updates.estimated_time = estimatedTime;
  if (status) updates.status = status;

  const { data: service, error } = await updateService(id, updates);

  if (error) {
    return res.status(500).json({ error: 'Failed to update service' });
  }

  res.json(service);
});

// Delete service
router.delete('/:id', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { error } = await deleteService(req.params.id);

  if (error) {
    return res.status(500).json({ error: 'Failed to delete service' });
  }

  res.json({ message: 'Service deleted' });
});

export default router;
