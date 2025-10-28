// packages/backend/controllers/leaderboard.controller.js
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "../models/user.model.js";

// Very lightweight weekly leaderboard using available fields.
// Since workout logs are not yet tracked, we derive a proxy score
// from activity recency and account age to avoid blocking UI work.
export const getWeeklyLeaderboard = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // Fetch a random sample of users to populate the board
    const sample = await User.findAll({
      attributes: ["user_id", "username", "fullName", "avatarUrl", "lastActiveAt", "created_at"],
      limit: 30,
      order: sequelize.random(),
      where: { status: { [Op.ne]: "BANNED" } },
    });

    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const clamp = (x, min, max) => Math.max(min, Math.min(max, x));

    const toScore = (u) => {
      const last = u.lastActiveAt ? new Date(u.lastActiveAt).getTime() : 0;
      const recency = last ? clamp(1 - (now - last) / weekMs, 0, 1) : 0; // 0..1
      const age = u.created_at ? (now - new Date(u.created_at).getTime()) : weekMs;
      const newcomerBoost = clamp(1 - age / (8 * weekMs), 0, 0.4); // <= 0.4 boost for new users
      const base = 60 * recency + 40 * newcomerBoost; // 0..100 approx
      // Random small jitter for variety
      const jitter = Math.random() * 5;
      return Math.round(base + jitter);
    };

    const items = sample.map((u) => ({
      id: u.user_id,
      username: u.username,
      fullName: u.fullName,
      avatarUrl: u.avatarUrl,
      score: toScore(u),
    }));

    // Ensure current user is present
    if (!items.some((i) => i.id === userId)) {
      const me = await User.findByPk(userId);
      if (me) {
        items.push({
          id: me.user_id,
          username: me.username,
          fullName: me.fullName,
          avatarUrl: me.avatarUrl,
          score: toScore(me),
        });
      }
    }

    const sorted = items.sort((a, b) => b.score - a.score).slice(0, 20);
    const myIndex = sorted.findIndex((i) => i.id === userId);

    return res.json({
      success: true,
      data: {
        items: sorted.map((x, idx) => ({ rank: idx + 1, ...x })),
        me: myIndex >= 0 ? { rank: myIndex + 1, ...sorted[myIndex] } : null,
        period: "week",
      },
    });
  } catch (err) {
    return next(err);
  }
};

