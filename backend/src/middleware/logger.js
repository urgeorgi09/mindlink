/**
 * Enterprise Request Logger
 * Следи за метод, път, статус код и време за обработка.
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Използваме 'finish' събитието на response обекта
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    // Цветово кодиране за по-лесно четене в конзолата (по избор)
    let icon = '✅';
    if (statusCode >= 400) icon = '⚠️';
    if (statusCode >= 500) icon = '🔥';

    console.log(`${icon} ${method} ${originalUrl} | Status: ${statusCode} | Time: ${duration}ms`);
  });

  next();
};