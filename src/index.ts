import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DataStore } from './services/dataStore';
import authRoutes from './routes/auth';
import debtRoutes from './routes/debts';
import userRoutes from './routes/users';
import { authenticateToken } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize data store with sample data
DataStore.initialize();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Debt Management API is running',
    timestamp: new Date().toISOString(),
    stats: DataStore.getStats()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/debts',authenticateToken, debtRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Debt Management API running on port ${PORT}`);
  console.log(`📊 Sample data initialized with ${DataStore.getStats().users} users and ${DataStore.getStats().debts} debts`);
  console.log(`🔗 API available at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

export default app; 