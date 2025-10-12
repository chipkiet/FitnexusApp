import { Router } from "express";
import { getAllExercises, getExercisesByMuscleGroup } from "../controllers/exercise.controller.js";

const router = Router();

// Get all exercises
router.get("/", getAllExercises);

// Get exercises by muscle group
router.get("/muscle/:muscleGroup", getExercisesByMuscleGroup);

export default router;
