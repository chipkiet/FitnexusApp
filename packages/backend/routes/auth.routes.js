import express from "express";
import rateLimit from "express-rate-limit";

import { register, login, me } from "../controllers/auth.controller.js";
import authGuard from "../middleware/auth.guard.js";
import { registerValidation, loginValidation } from "../middleware/auth.validation.js";

const router = express.Router();

// Limit 5–10 requests / 5 minutes / IP cho login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many login attempts, try again later." },
});

// POST /api/auth/register
router.post("/register", registerValidation, register);

// POST /api/auth/login
router.post("/login", loginLimiter, loginValidation, login);

// GET /api/auth/me
router.get("/me", authGuard, me);

export default router;