// packages/backend/routes/trainer.routes.js
import express from "express";
import authGuard from "../middleware/auth.guard.js";
import { requireTrainer } from "../middleware/role.guard.js";
import { listGroups, listExercisesByGroup } from "../controllers/trainer.controller.js";

const router = express.Router();

router.get("/tools", authGuard, requireTrainer, (req, res) => {
  res.json({
    success: true,
    message: "Trainer tools accessible",
    timestamp: new Date().toISOString(),
  });
});

router.get("/muscle-groups", listGroups);
router.get("/muscle-groups/:id/exercises", listExercisesByGroup);

export default router;
