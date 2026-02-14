import User from '../models/User.js';

/**
 * Middleware to check if user has required role
 */
export const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: 'Authentication required' 
        });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions' 
        });
      }

      req.userRole = user.role;
      req.userPermissions = user;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Permission check failed' 
      });
    }
  };
};

/**
 * Middleware to check specific permission
 */
export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: 'Authentication required' 
        });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      if (!user.hasPermission(permission)) {
        return res.status(403).json({ 
          success: false, 
          error: `Permission '${permission}' required` 
        });
      }

      req.userRole = user.role;
      req.userPermissions = user;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Permission check failed' 
      });
    }
  };
};

/**
 * Middleware to check resource access
 */
export const requireResourceAccess = (resource, action = 'read') => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: 'Authentication required' 
        });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      if (!user.canAccess(resource, action)) {
        return res.status(403).json({ 
          success: false, 
          error: `Access to '${resource}' with action '${action}' denied` 
        });
      }

      req.userRole = user.role;
      req.userPermissions = user;
      next();
    } catch (error) {
      console.error('Resource access check error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Access check failed' 
      });
    }
  };
};

/**
 * Middleware to allow access to own resources or admin/therapist access to others
 */
export const requireOwnershipOrRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ 
          success: false, 
          error: 'Authentication required' 
        });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      const targetUserId = req.params.userId || req.params.id;
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      // Allow if accessing own data or has required role
      if (req.user.id === targetUserId || allowedRoles.includes(user.role)) {
        req.userRole = user.role;
        req.userPermissions = user;
        return next();
      }

      return res.status(403).json({ 
        success: false, 
        error: 'Access denied: insufficient permissions' 
      });
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Access check failed' 
      });
    }
  };
};