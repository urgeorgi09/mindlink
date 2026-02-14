// Enterprise Error Handler
class AppError extends Error {
  constructor(message, statusCode, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Централизиран error handler
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development mode - пълна информация
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      errorCode: err.errorCode,
      stack: err.stack,
      path: req.path
    });
  }

  // Production mode - само безопасна информация
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      errorCode: err.errorCode
    });
  }

  // Неочаквани грешки - не показваме детайли
  console.error('💥 UNEXPECTED ERROR:', err);
  return res.status(500).json({
    success: false,
    error: 'Нещо се обърка. Моля опитай отново.',
    errorCode: 'INTERNAL_ERROR'
  });
};

// Async wrapper - премахва нуждата от try-catch
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    errorCode: 'NOT_FOUND'
  });
};

// Database error handler
export const handleDatabaseError = (error) => {
  if (error.name === 'SequelizeValidationError') {
    return new AppError('Невалидни данни', 400, 'VALIDATION_ERROR');
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return new AppError('Записът вече съществува', 409, 'DUPLICATE_ERROR');
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return new AppError('Невалидна референция', 400, 'FOREIGN_KEY_ERROR');
  }
  return new AppError('Грешка в базата данни', 500, 'DATABASE_ERROR');
};

export { AppError };
