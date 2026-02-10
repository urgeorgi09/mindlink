import jwt from "jsonwebtoken";
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const userIdHeader = req.headers["x-user-id"];

  // НЯМА токен → работим като анонимен user
  if (!authHeader) {
    req.user = { 
      id: userIdHeader || null,
      anonymous: true,
      role: 'user' // Anonymous users default to 'user' role
    };
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user role from database
    const user = await User.findById(decoded.id);
    
    req.user = {
      id: decoded.id,
      anonymous: false,
      role: user?.role || 'user'
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/**
 * Optional auth middleware - doesn't require authentication
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const userIdHeader = req.headers["x-user-id"];

  if (!authHeader) {
    req.user = { 
      id: userIdHeader || null,
      anonymous: true,
      role: 'user'
    };
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    req.user = {
      id: decoded.id,
      anonymous: false,
      role: user?.role || 'user'
    };
  } catch (error) {
    // If token is invalid, treat as anonymous
    req.user = { 
      id: userIdHeader || null,
      anonymous: true,
      role: 'user'
    };
  }

  next();
};

/**
 * Require authentication middleware
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required' 
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    req.user = {
      id: decoded.id,
      anonymous: false,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
};
