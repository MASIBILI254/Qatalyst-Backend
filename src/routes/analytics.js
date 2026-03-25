import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getTickets } from '../utils/database.js';

const router = express.Router();

// Get analytics dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  const { branchId, organizationId, startDate, endDate } = req.query;

  const filters = {};

  if (branchId) {
    filters.branchId = branchId;
  }

  if (organizationId) {
    filters.organizationId = organizationId;
  } else if (req.user.role !== 'super_admin') {
    filters.organizationId = req.user.organizationId;
  }

  const { data: tickets, error } = await getTickets(filters);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }

  const analytics = calculateAnalytics(tickets || [], startDate, endDate);
  res.json(analytics);
});

// Get daily analytics
router.get('/daily', authenticateToken, async (req, res) => {
  const { branchId, organizationId, date } = req.query;

  const filters = {};

  if (branchId) {
    filters.branchId = branchId;
  }

  if (organizationId) {
    filters.organizationId = organizationId;
  } else if (req.user.role !== 'super_admin') {
    filters.organizationId = req.user.organizationId;
  }

  const { data: tickets, error } = await getTickets(filters);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch daily analytics' });
  }

  const targetDate = date || new Date().toISOString().split('T')[0];
  const filtered = tickets?.filter(t => t.date === targetDate) || [];

  const dailyStats = {
    totalServed: filtered.filter(t => t.status === 'completed').length,
    totalWaiting: filtered.filter(t => t.status === 'waiting').length,
    totalCancelled: filtered.filter(t => t.status === 'cancelled').length,
    avgWaitTime: calculateAverageWaitTime(filtered),
    peakHour: calculatePeakHour(filtered),
  };

  res.json(dailyStats);
});

// Get service distribution
router.get('/services', authenticateToken, async (req, res) => {
  const { branchId, organizationId } = req.query;

  const filters = {};

  if (branchId) {
    filters.branchId = branchId;
  }

  if (organizationId) {
    filters.organizationId = organizationId;
  } else if (req.user.role !== 'super_admin') {
    filters.organizationId = req.user.organizationId;
  }

  const { data: tickets, error } = await getTickets(filters);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch service analytics' });
  }

  const distribution = {};
  const completed = tickets?.filter(t => t.status === 'completed') || [];

  completed.forEach(ticket => {
    distribution[ticket.service] = (distribution[ticket.service] || 0) + 1;
  });

  const result = Object.entries(distribution).map(([service, count]) => ({
    name: service,
    value: count,
  }));

  res.json(result);
});

function calculateAnalytics(tickets, startDate, endDate) {
  const filtered = tickets.filter(t => {
    if (!t.created_at) return false;
    const ticketDate = new Date(t.created_at);
    if (startDate && ticketDate < new Date(startDate)) return false;
    if (endDate && ticketDate > new Date(endDate)) return false;
    return true;
  });

  const served = filtered.filter(t => t.status === 'completed').length;
  const waiting = filtered.filter(t => t.status === 'waiting').length;
  const cancelled = filtered.filter(t => t.status === 'cancelled').length;

  return {
    totalServed: served,
    totalWaiting: waiting,
    totalCancelled: cancelled,
    avgWaitTime: calculateAverageWaitTime(filtered),
    serviceRate: served > 0 ? ((served / (served + cancelled)) * 100).toFixed(1) : 0,
  };
}

function calculateAverageWaitTime(tickets) {
  const completedSooner = tickets.filter(t => t.created_at && t.completed_at);
  
  if (completedSooner.length === 0) return 0;

  const totalWait = completedSooner.reduce((sum, ticket) => {
    const waitMs = new Date(ticket.completed_at) - new Date(ticket.created_at);
    return sum + (waitMs / 1000 / 60); // Convert to minutes
  }, 0);

  return Math.round(totalWait / completedSooner.length * 10) / 10;
}

function calculatePeakHour(tickets) {
  const hours = {};

  tickets.forEach(ticket => {
    if (ticket.created_at) {
      const hour = new Date(ticket.created_at).getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    }
  });

  let peakHour = 0;
  let maxCount = 0;

  Object.entries(hours).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = parseInt(hour);
    }
  });

  const period = peakHour < 12 ? 'AM' : 'PM';
  const displayHour = peakHour === 0 ? 12 : peakHour > 12 ? peakHour - 12 : peakHour;

  return `${displayHour}${period}`;
}

export default router;
