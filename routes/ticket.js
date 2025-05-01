const express = require('express');
const Ticket = require('../models/Ticket');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new ticket (only logged-in users can create tickets)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, priority } = req.body;
  try {
    const newTicket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: req.user._id
    });
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tickets (only agents and admins can access)
router.get('/', authMiddleware, roleMiddleware('agent', 'admin'), async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('createdBy assignedTo');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single ticket (accessible by the user or agent)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('createdBy assignedTo');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (ticket.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Unauthorized to view this ticket' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a ticket (only the owner or an agent can update)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (ticket.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Unauthorized to update this ticket' });
    }

    Object.assign(ticket, req.body);
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a ticket (only the owner or an agent can delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (ticket.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Unauthorized to delete this ticket' });
    }

    await ticket.remove();
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
