import express from "express";
import rateLimit from "express-rate-limit";
import { sendOtp, verifyOtp } from "../controllers/emailVerify.controller.js";

import { register, login, me, checkUsername, checkEmail, checkPhone, refreshToken, forgotPassword,
resetPassword, } from "../controllers/auth.controller.js";
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

// Limit 5 requests / 10 minutes / IP cho forgot-password
const forgotLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  limit: 5,                 // tối đa 5 lần / 10 phút / IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

// Limit 3 requests / 15 minutes / IP cho gửi OTP
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many OTP requests, try again later." },
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

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotLimiter, forgotPassword);

// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

// POST /api/auth/send-otp
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;