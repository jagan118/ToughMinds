import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.js';
import authRouter from './modules/auth/auth.routes.js';

const app = express();

// Standard middlewares
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4300', 'http://localhost:4201'],
  credentials: true
}));
app.use(express.json());

// Register API modules
app.use('/api/v1/auth', authRouter);

// API health endpoint (Phase 0 verification)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      timestamp: new Date(),
      uptime: process.uptime()
    }
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
