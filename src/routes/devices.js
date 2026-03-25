import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { generateId } from '../utils/auth.js';
import { getDevices, getDeviceById, createDevice, updateDevice } from '../utils/database.js';

const router = express.Router();

// Get devices
router.get('/', authenticateToken, async (req, res) => {
  const { organizationId, branchId, status, type } = req.query;

  const filters = {};
  
  if (organizationId) {
    filters.organizationId = organizationId;
  } else if (req.user.role !== 'super_admin') {
    filters.organizationId = req.user.organizationId;
  }

  if (branchId) filters.branchId = branchId;
  if (status) filters.status = status;

  const { data: devices, error } = await getDevices(filters);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch devices' });
  }

  const filtered = devices?.filter(d => !type || d.type === type) || [];
  res.json(filtered);
});

// Get device by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { data: device, error } = await getDeviceById(req.params.id);

  if (error || !device) {
    return res.status(404).json({ error: 'Device not found' });
  }

  if (req.user.organizationId !== device.organization_id && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json(device);
});

// Create device
router.post('/', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { name, type, branchId, organizationId, ipAddress, firmwareVersion = '1.0.0' } = req.body;

  if (!name || !type || !branchId) {
    return res.status(400).json({ error: 'Name, type, and branchId required' });
  }

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const deviceId = generateId('dev');
  const { data: device, error } = await createDevice({
    id: deviceId,
    name,
    type,
    organization_id: orgId,
    branch_id: branchId,
    status: 'offline',
    ip_address: ipAddress,
    firmware_version: firmwareVersion,
    last_ping_at: null,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to create device' });
  }

  res.status(201).json(device);
});

// Update device
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, status, ipAddress, firmwareVersion, lastPingAt } = req.body;

  const { data: existingDevice } = await getDeviceById(id);

  if (!existingDevice) {
    return res.status(404).json({ error: 'Device not found' });
  }

  if (req.user.organizationId !== existingDevice.organization_id && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const updates = {};
  if (name) updates.name = name;
  if (status) updates.status = status;
  if (ipAddress) updates.ip_address = ipAddress;
  if (firmwareVersion) updates.firmware_version = firmwareVersion;
  if (lastPingAt) updates.last_ping_at = lastPingAt;

  const { data: device, error } = await updateDevice(id, updates);

  if (error) {
    return res.status(500).json({ error: 'Failed to update device' });
  }

  res.json(device);
});

export default router;
