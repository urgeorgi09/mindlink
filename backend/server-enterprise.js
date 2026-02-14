// Enterprise MindLink Backend Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { checkDatabaseHealth, closeDatabaseConnection } from './config/database-enterprise.js';

// Middleware
import { compressionMiddleware, securityMiddleware, apiLimiter, authLimiter, responseTimeMiddleware, requestLogger } from './src/middleware/performance.js';
import { errorHandler, notFoundHandler, asyncHandler } from './src/middleware/errorHandler-enterprise.js';
import { trackRequest, healthCheck, getMetrics } from './src/middleware/monitoring.js';
import { requireAuth } from './src/middleware/authMiddleware.js';

// Routes (ще ги импортираме след като ги оптимизираме)
// import authRoutes from './src/routes/authRoutes.js';
// import moodRoutes from './src/routes/moodRoutes.js';
// import chatRoutes from './src/routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// ENTERPRISE MIDDLEWARE STACK
// ============================================

// 1. Security & Performance
app.use(securityMiddleware);
app.use(compressionMiddleware);
app.use(responseTimeMiddleware);
app.use(trackRequest);
app.use(requestLogger);

// 2. CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 4. Rate Limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ============================================
// HEALTH & MONITORING ENDPOINTS
// ============================================
app.get('/health', healthCheck);
app.get('/metrics', requireAuth, getMetrics);

// ============================================
// API ROUTES
// ============================================
// app.use('/api/auth', authRoutes);
// app.use('/api/mood', moodRoutes);
// app.use('/api/chat', chatRoutes);

// Temporary test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Enterprise Backend Running',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// DATABASE INITIALIZATION & SERVER START
// ============================================
const startServer = async () => {
  try {
    // 1. Check database connection
    console.log('🔄 Checking database connection...');
    const dbHealthy = await checkDatabaseHealth();
    
    if (!dbHealthy) {
      throw new Error('Database connection failed');
    }

    // 2. Sync models (без force в production!)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: false });
      console.log('✅ Database models synchronized');
    }

    // 3. Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🚀 ═══════════════════════════════════════════════');
      console.log('   MINDLINK ENTERPRISE BACKEND');
      console.log('🚀 ═══════════════════════════════════════════════');
      console.log(`📡 Server:      http://localhost:${PORT}`);
      console.log(`🔧 API:         http://localhost:${PORT}/api`);
      console.log(`💚 Health:      http://localhost:${PORT}/health`);
      console.log(`📊 Metrics:     http://localhost:${PORT}/metrics`);
      console.log(`🐘 Database:    Connected`);
      console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('═══════════════════════════════════════════════');
      console.log('');
    });

    // 4. Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('🔌 HTTP server closed');
        await closeDatabaseConnection();
        console.log('✅ Graceful shutdown complete');
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('💥 UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
