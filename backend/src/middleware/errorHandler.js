/**
 * Enterprise Centralized Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  // 1. Логване на грешката със стекова следа за разработчика
  console.error(`🔥 [${new Date().toISOString()}] ERROR:`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // 2. Определяне на статус код
  let statusCode = err.status || 500;
  let message = err.message || "Unexpected server error.";

  // 3. Специфична обработка за Sequelize (Postgres)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  // 4. Специфична обработка за JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Невалиден токен за достъп.';
  }

  // 5. Enterprise сигурност: Скриване на детайли в Production
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(statusCode).json({
    success: false,
    error: isProduction ? "Възникна системна грешка. Моля, опитайте по-късно." : message,
    // В Development режим връщаме стека за лесно дебъгване
    stack: isProduction ? undefined : err.stack 
  });
};