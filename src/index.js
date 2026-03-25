import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import 'express-async-errors';

dotenv.config();
 //Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import organizationRoutes from './routes/organizations.js';
import branchRoutes from './routes/branches.js';
import staffRoutes from './routes/staff.js';
import deviceRoutes from './routes/devices.js';
import queueRoutes from './routes/queue.js';
import servicesRoutes from './routes/services.js';
import ticketsRoutes from './routes/tickets.js';
import analyticsRoutes from './routes/analytics.js';
import auditLogRoutes from './routes/auditLogs.js';
import notificationsRoutes from './routes/notifications.js';
import billingRoutes from './routes/billing.js';
import settingsRoutes from './routes/settings.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/services', servicesRoutes);
app.use('/tickets', ticketsRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
