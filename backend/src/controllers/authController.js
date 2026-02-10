import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * POST /api/auth/register
 * Register new user with role selection
 */
export const register = async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password required' 
      });
    }

    if (!['user', 'therapist', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role. Must be user, therapist, or admin' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 'auth.email': email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userId = Date.now().toString(); // Simple ID generation
    const user = await User.create({
      _id: userId,
      role,
      auth: {
        email,
        password: hashedPassword,
        verified: false
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.auth.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/auth/login
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password required' 
      });
    }

    // Find user
    const user = await User.findOne({ 'auth.email': email }).select('+auth.password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.auth.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.auth.email,
        role: user.role,
        lastActive: user.lastActive
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/auth/me
 * Get current user info
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-auth.password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.auth?.email,
        role: user.role,
        settings: user.settings,
        stats: user.stats,
        createdAt: user.createdAt,
        lastActive: user.lastActive
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};