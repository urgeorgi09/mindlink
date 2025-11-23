import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// ==================== CORS Configuration ====================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://mindlinkplus.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments
    if (origin && origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-ml-user']
}));

// ==================== Security & Middleware ====================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минути
  max: 200, // максимум 200 заявки
  message: 'Твърде много заявки, моля опитайте по-късно',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// ==================== Routes ====================
import emotionsRoutes from './routes/emotions.js';
import chatRoutes from './routes/chat.js';
import journalRoutes from './routes/journal.js';
import userRoutes from './routes/user.js';

app.use('/api/emotions', emotionsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/user', userRoutes);

// ==================== Health Check ====================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'MindLink+ API',
    version: '1.0.0',
    endpoints: {
      emotions: '/api/emotions',
      chat: '/api/chat',
      journal: '/api/journal',
      user: '/api/user'
    }
  });
});

// ==================== 404 Handler ====================
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint не е намерен',
    path: req.path
  });
});

// ==================== Error Handler ====================
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  
  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS грешка - невалиден origin'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Вътрешна грешка на сървъра',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== MongoDB Connection ====================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindlink';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📍 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ==================== Start Server ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for:`, allowedOrigins);
  console.log(`🔐 Encryption: ${process.env.ENC_KEY ? 'Enabled' : '⚠️  WARNING: Using default key!'}`);
});

export default app;