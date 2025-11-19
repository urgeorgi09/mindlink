import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/database.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

import emotionRoutes from './routes/emotionRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import therapistRoutes from './routes/therapistRoutes.js';

dotenv.config();

const app = express();

// ==================== SECURITY ====================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'X-User-Id', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Твърде много заявки. Моля, изчакайте.'
});
app.use('/api/', limiter);

// ==================== MIDDLEWARE ====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// ==================== ROUTES ====================
app.use('/api/emotions', emotionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/therapists', therapistRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// ==================== ERROR HANDLING ====================
app.use(errorHandler);

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🚀 MindLink+ Server Running          ║
║                                        ║
║   📡 Port: ${PORT}                     ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}
║   🔗 Frontend: ${process.env.CORS_ORIGIN}
║                                        ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  process.exit(1);
});

startServer();

export default app;