// backend/src/middleware/logger.js
export const requestLogger = (req, res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl}`);
  next();
};
