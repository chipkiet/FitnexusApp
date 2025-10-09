import express from "express";
import onboardingSessionGuard from "../middleware/onboardingSession.guard.js";
import { getStep, saveAnswer, getSessionStatus } from "../controllers/onboarding.controller.js";

const router = express.Router();

// Require auth (JWT or session)
router.use(onboardingSessionGuard);

// Session status
router.get("/session", getSessionStatus);

// Fetch step definition (e.g., age)
router.get("/steps/:key", getStep);

// Save step answer (creates session if needed)
router.post("/steps/:key/answer", saveAnswer);

export default router;
