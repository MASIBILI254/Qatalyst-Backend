import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getTickets } from '../utils/database.js';

const router = express.Router();

// Get queue status for branch
router.get('/status/:branchId', authenticateToken, async (req, res) => {
  const { branchId } = req.params;

  const { data: tickets, error } = await getTickets({ branchId });

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch queue status' });
  }

  const status = {
    waiting: tickets?.filter(t => t.status === 'waiting').length || 0,
    serving: tickets?.filter(t => t.status === 'serving').length || 0,
    completed: tickets?.filter(t => t.status === 'completed').length || 0,
    cancelled: tickets?.filter(t => t.status === 'cancelled').length || 0,
    avgWaitTime: calculateAverageWaitTime(tickets || []),
  };

  res.json(status);
});

// Get queues for all branches in organization
router.get('/', authenticateToken, async (req, res) => {
  const { organizationId } = req.query;

  const orgId = organizationId || req.user.organizationId;

  if (req.user.organizationId !== orgId && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { data: tickets, error } = await getTickets({ organizationId: orgId });

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch queues' });
  }

  const queues = groupTicketsByBranch(tickets || []);
  res.json(queues);
});

function groupTicketsByBranch(tickets) {
  const grouped = {};
  
  tickets.forEach(ticket => {
    if (!grouped[ticket.branch_id]) {
      grouped[ticket.branch_id] = {
        branchId: ticket.branch_id,
        branchName: ticket.branch_name,
        waiting: 0,
        serving: 0,
        completed: 0,
        cancelled: 0,
      };
    }
    
    if (ticket.status === 'waiting') grouped[ticket.branch_id].waiting++;
    else if (ticket.status === 'serving') grouped[ticket.branch_id].serving++;
    else if (ticket.status === 'completed') grouped[ticket.branch_id].completed++;
    else if (ticket.status === 'cancelled') grouped[ticket.branch_id].cancelled++;
  });

  return Object.values(grouped);
}

function calculateAverageWaitTime(tickets) {
  const waitingTickets = tickets.filter(t => t.status === 'waiting');
  
  if (waitingTickets.length === 0) return 0;

  const totalWait = waitingTickets.reduce((sum, ticket) => {
    if (ticket.created_at) {
      const waitMs = new Date() - new Date(ticket.created_at);
      return sum + (waitMs / 1000 / 60); // Convert to minutes
    }
    return sum;
  }, 0);

  return Math.round(totalWait / waitingTickets.length);
}

export default router;
