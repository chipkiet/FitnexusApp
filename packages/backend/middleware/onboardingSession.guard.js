import jwt from "jsonwebtoken";
import crypto from "crypto";

// Accepts one of:
// - Bearer JWT → set req.userId, req.userRole
// - Passport session (req.user) → set req.userId, req.userRole
// - Anonymous express-session → ensure req.session.onboardingSessionId exists
export default function onboardingSessionGuard(req, res, next) {
  try {
    // 1) Try Bearer JWT
    const header = req.get("authorization") || req.get("Authorization") || "";
    const [scheme, token] = header.split(" ");
    if (scheme === "Bearer" && token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.sub || payload.userId || payload.id || null;
        req.userRole = payload.role || null;
        if (req.userId) return next();
      } catch (_e) {
        // ignore and fall through to session paths
      }
    }

    // 2) Try Passport session
    if (typeof req.isAuthenticated === "function" && req.isAuthenticated() && req.user) {
      const u = req.user;
      const id = u.user_id || u.id || (typeof u.get === "function" ? u.get("user_id") : null);
      if (id) {
        req.userId = id;
        req.userRole = u.role || null;
        return next();
      }
    }

    // 3) Anonymous onboarding via express-session
    if (req.session) {
      if (!req.session.onboardingSessionId) {
        // Initialize a stable anonymous onboarding session id bound to this cookie session
        req.session.onboardingSessionId = crypto.randomUUID();
      }
      // Expose for downstream handlers if needed
      req.onboardingSessionId = req.session.onboardingSessionId;
      return next();
    }

    // Fallback — if no session middleware mounted (shouldn't happen), block
    return res.status(401).json({ success: false, message: "Unauthorized" });
  } catch (_err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

