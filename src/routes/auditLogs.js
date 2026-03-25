import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { getAuditLogs, createAuditLog } from '../utils/database.js';

const router = express.Router();

// Get audit logs
router.get('/', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { organizationId, userId, action, limit = 100 } = req.query;

  const filters = {};

  if (organizationId) {
    filters.organizationId = organizationId;
  } else if (req.user.role !== 'super_admin') {
    filters.organizationId = req.user.organizationId;
  }

  if (userId) filters.userId = userId;
  if (action) filters.action = action;

  const { data: logs, error } = await getAuditLogs(filters, parseInt(limit));

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch audit logs' });
  }

  res.json(logs || []);
});

// Log activity
router.post('/', authenticateToken, async (req, res) => {
  const { action, resource, resourceId, details, ipAddress, userAgent } = req.body;

  if (!action || !resource) {
    return res.status(400).json({ error: 'Action and resource required' });
  }

  const { data: log, error } = await createAuditLog({
    user_id: req.user.id,
    organization_id: req.user.organizationId,
    action,
    resource,
    resource_id: resourceId,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
    timestamp: new Date().toISOString(),
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to create audit log' });
  }

  res.status(201).json(log);
});

export default router;
