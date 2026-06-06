// src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './modules/auth/authRoutes';
import courseRoutes from './modules/courses/courseRoutes';
import paymentRoutes from './modules/payments/paymentRoutes';
import adminRoutes from './modules/admin/adminRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import { contactSubmit } from './controllers/adminController';

const app = express();

// Security middlewares
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', limiter);

// Ping endpoint
app.get('/ping', (_req, res) => res.status(200).send('Pong'));

// Register routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.post('/api/v1/contact', contactSubmit);

// 404 fallback
app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} not found` });
});

// Error middleware
app.use(errorMiddleware);

export default app;
