// Enterprise-grade validation middleware
import { body, validationResult } from 'express-validator';

// Централизирана обработка на грешки
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })) 
    });
  }
  next();
};

// Emotion validation rules
export const validateEmotion = [
  body('mood').isInt({ min: 1, max: 10 }).withMessage('Mood must be 1-10'),
  body('energy').isInt({ min: 1, max: 10 }).withMessage('Energy must be 1-10'),
  body('anxiety').optional().isInt({ min: 1, max: 10 }).withMessage('Anxiety must be 1-10'),
  body('note').optional().isString().trim().isLength({ max: 500 }).withMessage('Note max 500 chars'),
  handleValidationErrors
];

// Message validation
export const validateMessage = [
  body('text').isString().trim().notEmpty().isLength({ max: 2000 }).withMessage('Message 1-2000 chars'),
  body('recipientId').isInt().withMessage('Invalid recipient'),
  handleValidationErrors
];

// Journal validation
export const validateJournal = [
  body('title').isString().trim().notEmpty().isLength({ max: 200 }).withMessage('Title 1-200 chars'),
  body('content').isString().trim().notEmpty().isLength({ max: 10000 }).withMessage('Content 1-10000 chars'),
  body('category').optional().isString().isIn(['Personal', 'Gratitude', 'Goals', 'Reflection']),
  handleValidationErrors
];

// Auth validation
export const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  body('name').isString().trim().notEmpty().isLength({ max: 100 }).withMessage('Name required'),
  body('role').optional().isIn(['user', 'therapist']).withMessage('Invalid role'),
  handleValidationErrors
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];