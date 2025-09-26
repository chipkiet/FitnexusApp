import express from "express";
import rateLimit from "express-rate-limit";
import passport from "passport";
import jwt from "jsonwebtoken";
import { sendOtp, verifyOtp } from "../controllers/emailVerify.controller.js";

import {
  register,
  login,
  me,
  checkUsername,
  checkEmail,
  checkPhone,
  refreshToken,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import authGuard from "../middleware/auth.guard.js";
import { registerValidation, loginValidation } from "../middleware/auth.validation.js";

const router = express.Router();

// Limit login attempts
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

// Local Auth APIs
router.post("/register", registerValidation, register);
router.post("/login", loginLimiter, loginValidation, login);
router.get("/me", authGuard, me);
router.get("/check-username", checkUsername);
router.get("/check-email", checkEmail);
router.get("/check-phone", checkPhone);
router.post("/refresh", refreshToken);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    const oauthUser = req.user;

    // Update last login timestamp (best effort)
    if (oauthUser && typeof oauthUser.save === "function") {
      oauthUser.lastLoginAt = new Date();
      oauthUser.save({ fields: ["lastLoginAt"] }).catch(() => {});
    }

    // Create JWT
    const userId = oauthUser.id ?? oauthUser.user_id ?? oauthUser._id;
    const accessToken = jwt.sign(
      { sub: userId, role: oauthUser.role, type: "access" },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    const isNew = oauthUser?.get?.("isNew") ? 1 : 0;

    // Remove sensitive fields
    const safeUser = (() => {
      try {
        const { passwordHash, providerId, ...rest } = oauthUser.toJSON();
        return rest;
      } catch {
        return {};
      }
    })();

    // Compute origin for postMessage
    let targetOrigin = "*";
    try {
      targetOrigin = new URL(process.env.FRONTEND_URL).origin;
    } catch {
      targetOrigin = "*";
    }

    // Safe stringify to avoid </script> breaking HTML
    const safe = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

    res.type("html").send(`<!doctype html>
<html><head><meta charset="utf-8"/></head><body>
<script>
  (function() {
    try {
      var payload = {
        source: "oauth",
        provider: "google",
        status: "success",
        token: ${safe(accessToken)},
        isNew: ${safe(isNew)},
        user: ${safe(safeUser)}
      };
      if (window.opener && typeof window.opener.postMessage === "function") {
        window.opener.postMessage(payload, ${JSON.stringify(targetOrigin)});
      }
    } catch (e) {
    } finally {
      window.close();
      setTimeout(function(){
        try { window.location.replace(${JSON.stringify(process.env.FRONTEND_URL)}); } catch(_) {}
      }, 300);
    }
  })();
</script>
OK
</body></html>`);
  }
);

// Logout (only needed if you still use sessions)
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect(process.env.FRONTEND_URL);
  });
});


// POST /api/auth/forgot-password
router.post("/forgot-password", forgotLimiter, forgotPassword);

// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

// POST /api/auth/send-otp
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;
