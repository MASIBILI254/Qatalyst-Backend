import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get settings
router.get('/', authenticateToken, async (req, res) => {
  const { organizationId } = req.query;

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json({
    organizationId: orgId,
    theme: 'system',
    language: 'en',
    timezone: 'Africa/Lagos',
    notifications: {
      email: true,
      sms: true,
      inApp: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      ipWhitelist: [],
    },
  });
});

// Update settings
router.put('/', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { organizationId, theme, language, timezone, notifications, security } = req.body;

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json({
    organizationId: orgId,
    theme: theme || 'system',
    language: language || 'en',
    timezone: timezone || 'Africa/Lagos',
    notifications: notifications || { email: true, sms: true, inApp: true },
    security: security || { twoFactorAuth: false, sessionTimeout: 30, ipWhitelist: [] },
  });
});

// Get feature flags
router.get('/features', authenticateToken, async (req, res) => {
  res.json({
    queueManagement: true,
    realTimeMonitoring: true,
    analyticsReports: true,
    staffManagement: true,
    deviceManagement: true,
    auditLogs: true,
    notifications: true,
    billing: true,
    apiAccess: true,
  });
});

// Get integrations
router.get('/integrations', authenticateToken, authorize('super_admin', 'org_admin'), async (req, res) => {
  res.json([
    {
      id: 'sms_gateway',
      name: 'SMS Gateway',
      status: 'connected',
      provider: 'Twilio',
    },
    {
      id: 'email_service',
      name: 'Email Service',
      status: 'connected',
      provider: 'SendGrid',
    },
  ]);
});

export default router;
