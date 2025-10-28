// packages/backend/routes/leaderboard.routes.js
import { Router } from "express";
import authOrSession from "../middleware/authOrSession.guard.js";
import { getWeeklyLeaderboard } from "../controllers/leaderboard.controller.js";

const router = Router();

// GET /api/leaderboards?period=week
router.get("/", authOrSession, getWeeklyLeaderboard);

export default router;
