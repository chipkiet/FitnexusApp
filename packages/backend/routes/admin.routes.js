import express from 'express';
import authGuard from '../middleware/auth.guard.js';
import { requireAdmin } from '../middleware/role.guard.js';
import { body, param, query, validationResult } from 'express-validator';
import { listUsers, updateUserRole, updateUserPlan } from '../controllers/admin.controller.js';

const router = express.Router();

// GET /api/admin/health - ADMIN only
router.get('/health', authGuard, requireAdmin, (_req, res) => {
  res.json({ success: true, message: 'Admin route OK', timestamp: new Date().toISOString() });
});

// GET /api/admin/users - list users (safe fields)
router.get(
  '/users',
  authGuard,
  requireAdmin,
  [
    query('limit').optional().isInt({ min: 1, max: 200 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    query('search').optional().isString().trim().isLength({ max: 255 }),
    query('plan')
      .optional()
      .customSanitizer((v) => String(v).trim().toUpperCase())
      .isIn(['FREE', 'PREMIUM'])
      .withMessage('Invalid plan'),
    query('role')
      .optional()
      .customSanitizer((v) => String(v).trim().toUpperCase())
      .isIn(['USER', 'TRAINER', 'ADMIN'])
      .withMessage('Invalid role'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation error', errors: errors.array() });
    }
    return listUsers(req, res, next);
  }
);

// PATCH /api/admin/users/:id/role - update role
router.patch(
  '/users/:id/role',
  authGuard,
  requireAdmin,
  [
    param('id').isInt({ min: 1 }).toInt(),
    body('role').isIn(['USER', 'TRAINER', 'ADMIN']).withMessage('Invalid role'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation error', errors: errors.array() });
    }
    return updateUserRole(req, res, next);
  }
);

// PATCH /api/admin/users/:id/plan - update subscription plan
router.patch(
  '/users/:id/plan',
  authGuard,
  requireAdmin,
  [
    param('id').isInt({ min: 1 }).toInt(),
    body('plan')
      .customSanitizer((v) => String(v).trim().toUpperCase())
      .isIn(['FREE', 'PREMIUM'])
      .withMessage('Invalid plan'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation error', errors: errors.array() });
    }
    return updateUserPlan(req, res, next);
  }
);

export default router;
