// packages/backend/controllers/trainer.controller.js
import { sequelize } from "../config/database.js";
import * as SequelizeNS from "sequelize";           // ← lấy DataTypes từ package
import initTrainerModels from "../models/trainer.init.js";

const models = initTrainerModels(sequelize, SequelizeNS.DataTypes);

// GET /api/trainer/muscle-groups
export async function listGroups(_req, res) {
  try {
    const groups = await models.MuscleGroup.findAll({
      attributes: ["muscle_group_id", "name", "name_en", "slug", "description"],
      order: [["muscle_group_id", "ASC"]],
    });
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không tải được danh sách nhóm cơ" });
  }
}

// GET /api/trainer/muscle-groups/:id/exercises
export async function listExercisesByGroup(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const group = await models.MuscleGroup.findByPk(id, {
      attributes: ["muscle_group_id", "name", "name_en"],
      include: [
        {
          model: models.Exercise,
          attributes: ["exercise_id", "name", "name_en", "slug", "description"],
          through: {
            attributes: ["impact_level", "intensity_percentage", "activation_note"],
          },
        },
      ],
      order: [[models.Exercise, "exercise_id", "ASC"]],
    });

    if (!group) return res.status(404).json({ message: "Không tìm thấy nhóm cơ" });
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không tải được bài tập theo nhóm cơ" });
  }
}

const VXPTrainerController = { listGroups, listExercisesByGroup };
export default VXPTrainerController;
