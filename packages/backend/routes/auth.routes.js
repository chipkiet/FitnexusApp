import express from 'express';
import { register } from '../controllers/auth.controller.js';
import { registerValidation } from '../middleware/auth.validation.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerValidation, register);

export default router;