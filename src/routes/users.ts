import { Router } from 'express';
import { getAllUsers } from '../services/authService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/users
// Requires authentication
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const users = await getAllUsers(req.user.id);
    res.json({ success: true, data: { users } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

export default router; 