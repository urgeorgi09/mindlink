import jwt from "jsonwebtoken";
import User from '../models/User.js'; // Твоят Sequelize модел

/**
 * Основна логика за верификация (Core Logic)
 */
const verifyToken = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  
  const token = authHeader.split(" ")[1];
  try {
    // Декодираме токена. Enterprise стандарт: Ролята е вътре в токена!
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      id: decoded.id,
      role: decoded.role || 'user',
      anonymous: false
    };
  } catch (err) {
    return null;
  }
};

/**
 * Гъвкав Middleware - поддържа и анонимни, и логнати
 */
export const authMiddleware = async (req, res, next) => {
  const authData = await verifyToken(req.headers.authorization);
  
  if (authData) {
    req.user = authData;
  } else {
    // Анонимен потребител - НИКОГА не взимаме ID от хедър за сигурност
    req.user = { id: null, role: 'guest', anonymous: true };
  }
  next();
};

/**
 * Строг Middleware - изисква задължителна аутентикация
 */
export const requireAuth = async (req, res, next) => {
  const authData = await verifyToken(req.headers.authorization);
  
  if (!authData) {
    return res.status(401).json({ 
      success: false, 
      error: 'Изисква се влизане в системата' 
    });
  }

  req.user = authData;
  next();
};

/**
 * Middleware за роли (Role-Based Access Control - RBAC)
 * Пример: restrictTo('admin', 'therapist')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (req.user.anonymous || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Нямате права за това действие' 
      });
    }
    next();
  };
};