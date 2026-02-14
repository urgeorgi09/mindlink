// Enterprise Health Check & Monitoring
import { checkDatabaseHealth } from '../../config/database-enterprise.js';
import cache from '../utils/cache.js';

// System metrics
const metrics = {
  startTime: Date.now(),
  requests: 0,
  errors: 0,
  avgResponseTime: 0,
  responseTimes: []
};

// Track request
export const trackRequest = (req, res, next) => {
  metrics.requests++;
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.responseTimes.push(duration);
    
    // Keep only last 100 response times
    if (metrics.responseTimes.length > 100) {
      metrics.responseTimes.shift();
    }
    
    // Calculate average
    metrics.avgResponseTime = Math.round(
      metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length
    );
    
    if (res.statusCode >= 500) {
      metrics.errors++;
    }
  });
  
  next();
};

// Health check endpoint
export const healthCheck = async (req, res) => {
  const dbHealthy = await checkDatabaseHealth();
  const uptime = Math.floor((Date.now() - metrics.startTime) / 1000);
  
  const health = {
    status: dbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 60)}m ${uptime % 60}s`,
    database: dbHealthy ? 'connected' : 'disconnected',
    cache: {
      size: cache.size(),
      enabled: true
    },
    metrics: {
      totalRequests: metrics.requests,
      totalErrors: metrics.errors,
      errorRate: metrics.requests > 0 ? ((metrics.errors / metrics.requests) * 100).toFixed(2) + '%' : '0%',
      avgResponseTime: metrics.avgResponseTime + 'ms'
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    }
  };
  
  res.status(dbHealthy ? 200 : 503).json(health);
};

// Metrics endpoint (admin only)
export const getMetrics = (req, res) => {
  res.json({
    ...metrics,
    cacheStats: cache.stats(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  });
};

export default { trackRequest, healthCheck, getMetrics };
