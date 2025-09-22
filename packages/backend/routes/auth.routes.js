import express from "express";
import rateLimit from "express-rate-limit";

import { register, login, me, checkUsername, checkEmail, checkPhone, refreshToken } from "../controllers/auth.controller.js";
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

// GET /api/auth/check-username
router.get("/check-username", checkUsername);

// GET /api/auth/check-email
router.get("/check-email", checkEmail);

// GET /api/auth/check-phone
router.get("/check-phone", checkPhone);

router.post("/refresh", refreshToken);
export default router;