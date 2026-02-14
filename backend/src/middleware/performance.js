// Enterprise Performance Middleware
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Compression за намаляване на response size
export const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6 // Balance между скорост и компресия
});

// Security headers
export const securityMiddleware = helmet({
  contentSecurityPolicy: false, // За React app
  crossOriginEmbedderPolicy: false
});

// Rate limiting - защита от DDoS
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минути
  max: 100, // 100 requests per IP
  message: { success: false, error: 'Твърде много заявки. Опитай след 15 минути.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict limiter за auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Само 5 login опита
  message: { success: false, error: 'Твърде много опити за вход. Изчакай 15 минути.' }
});

// Response time tracking
export const responseTimeMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`⚠️ Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  next();
};

// Request logging (production-ready)
export const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
  }
  next();
};
