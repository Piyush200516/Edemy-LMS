import express from 'express';
import Log from '../models/Log.js';
import { sequelize, Invoice } from '../configs/postgres.js';

const router = express.Router();

// POST /api/accounting/invoice - Create invoice (Postgres)
router.post('/invoice', async (req, res) => {
  try {
    const { date, amount, description } = req.body;
    const newInvoice = await Invoice.create({ date, amount, description });
    
    // Log to MongoDB
    await Log.create({ action: 'invoice_created', details: `Invoice #${newInvoice.id}: ${amount}` });
    
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accounting/invoices - List invoices
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accounting/logs - List logs (Mongo)
router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(10);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

