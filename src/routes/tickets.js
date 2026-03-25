import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { generateId } from '../utils/auth.js';
import { getTickets, createTicket, updateTicket } from '../utils/database.js';

const router = express.Router();

// Get tickets
router.get('/', authenticateToken, async (req, res) => {
  const { branchId, organizationId, status } = req.query;

  const filters = {};

  if (branchId) {
    filters.branchId = branchId;
  }

  if (organizationId) {
    filters.organizationId = organizationId;
  } else if (req.user.role !== 'super_admin') {
    filters.organizationId = req.user.organizationId;
  }

  if (status) {
    filters.status = status;
  }

  const { data: tickets, error } = await getTickets(filters);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }

  res.json(tickets || []);
});

// Create ticket
router.post('/', authenticateToken, async (req, res) => {
  const { customerName, service, priority = 'normal', branchId, organizationId } = req.body;

  if (!customerName || !service || !branchId) {
    return res.status(400).json({ error: 'CustomerName, service, and branchId required' });
  }

  const orgId = organizationId || req.user.organizationId;

  const ticketId = generateId('tkt');
  const ticketNumber = generateTicketNumber();

  const { data: ticket, error } = await createTicket({
    id: ticketId,
    ticket_number: ticketNumber,
    customer_name: customerName,
    service,
    priority,
    status: 'waiting',
    branch_id: branchId,
    organization_id: orgId,
    created_at: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to create ticket' });
  }

  res.status(201).json(ticket);
});

// Update ticket status
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, counter } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status required' });
  }

  const updates = {
    status,
  };

  if (counter) {
    updates.counter = counter;
  }

  if (status === 'serving' && !updates.served_at) {
    updates.served_at = new Date().toISOString();
  }

  if (status === 'completed' && !updates.completed_at) {
    updates.completed_at = new Date().toISOString();
  }

  const { data: ticket, error } = await updateTicket(id, updates);

  if (error) {
    return res.status(500).json({ error: 'Failed to update ticket' });
  }

  res.json(ticket);
});

function generateTicketNumber() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const number = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `${letter}-${number}`;
}

export default router;
