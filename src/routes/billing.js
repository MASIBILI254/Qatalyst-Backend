import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get billing info
router.get('/info', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { organizationId } = req.query;

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json({
    organizationId: orgId,
    subscriptionTier: 'professional',
    subscriptionStatus: 'active',
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    monthlyUsage: {
      tickets: 15200,
      limit: 20000,
    },
    pricing: {
      monthly: 285000,
      priorityTickets: 5,
      addons: 30000,
    },
  });
});

// Get invoices
router.get('/invoices', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { organizationId } = req.query;

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json([
    {
      id: 'inv_001',
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 315000,
      status: 'paid',
      items: [
        { description: 'Monthly subscription', amount: 285000 },
        { description: 'Priority tickets', amount: 30000 },
      ],
    },
    {
      id: 'inv_002',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 315000,
      status: 'paid',
      items: [
        { description: 'Monthly subscription', amount: 285000 },
        { description: 'Priority tickets', amount: 30000 },
      ],
    },
  ]);
});

// Get subscription details
router.get('/subscription', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { organizationId } = req.query;

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json({
    id: 'sub_001',
    organizationId: orgId,
    tier: 'professional',
    status: 'active',
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    features: [
      'Queue Management',
      'Real-time Monitoring',
      'Analytics & Reports',
      'Staff Management',
      'Device Management',
      'Audit Logs',
    ],
    limits: {
      branches: 10,
      staff: 50,
      devices: 100,
      queuesPerDay: 20000,
    },
  });
});

export default router;
