import { Router } from 'express';
import * as authService from '../services/authService';

const router = Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// Get current user profile
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authenticated'
    });
  }
  
  const { password: _, ...userWithoutPassword } = req.user;
  
  const response = {
    success: true,
    data: {
      user: userWithoutPassword
    }
  };
  
  res.json(response);
});

export default router; 