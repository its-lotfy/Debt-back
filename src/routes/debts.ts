import { Router } from 'express';
import * as debtService from '../services/debtChainService';
import { authMiddleware } from '../middleware/auth';
import { CreateDebtRequest } from '../types';

const router = Router();

// Middleware to protect all debt routes
router.use(authMiddleware);

// GET /api/debts - Get all debts for the logged-in user
router.get('/', async (req: any, res) => {
  try {
    const status = req.query.status as 'active' | 'settled' | undefined;
    const debts = await debtService.getAllDebts(req.user.id, status);
    res.json({ success: true, data: { debts } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch debts' });
  }
});

// POST /api/debts - Create a new debt
router.post('/', async (req: any, res) => {
  try {
    const { debtorId, amount, description, dueDate }: CreateDebtRequest = req.body;
    const creditorId = req.user.id;

    if (!debtorId || !amount || !description || !dueDate) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const debt = await debtService.createDebt(
      creditorId,
      debtorId,
      amount,
      description,
      new Date(dueDate)
    );
    res.status(201).json({ success: true, data: { debt } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to create debt' });
  }
});

// GET /api/debts/summary - Get a summary for the dashboard
router.get('/summary', async (req: any, res) => {
  try {
    const summary = await debtService.getDebtSummary(req.user.id);
    res.json({ success: true, data: { summary } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch summary' });
  }
});

// GET /api/debts/chains - Find debt chains
router.get('/chains', async (req, res) => {
  try {
    const chains = await debtService.findDebtChains();
    res.json({ success: true, data: { chains } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to find debt chains' });
  }
});

export default router; 