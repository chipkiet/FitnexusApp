// packages/backend/models/trainer.init.js
import defineExercise from "./exercise.model.js";
import defineMuscleGroup from "./muscleGroup.model.js";
import defineExerciseMuscleGroup from "./exerciseMuscleGroup.model.js";

let _cached = null;

export default function initTrainerModels(sequelize, DataTypes) {
  if (_cached) return _cached;

  const Exercise =
    sequelize.models.Exercise || defineExercise(sequelize, DataTypes);
  const MuscleGroup =
    sequelize.models.MuscleGroup || defineMuscleGroup(sequelize, DataTypes);
  const ExerciseMuscleGroup =
    sequelize.models.ExerciseMuscleGroup ||
    defineExerciseMuscleGroup(sequelize, DataTypes);

  if (!Exercise.associations?.MuscleGroups || !MuscleGroup.associations?.Exercises) {
    Exercise.belongsToMany(MuscleGroup, {
      through: ExerciseMuscleGroup,
      foreignKey: "exercise_id",
      otherKey: "muscle_group_id",
    });
    MuscleGroup.belongsToMany(Exercise, {
      through: ExerciseMuscleGroup,
      foreignKey: "muscle_group_id",
      otherKey: "exercise_id",
    });
  }

  _cached = { Exercise, MuscleGroup, ExerciseMuscleGroup };
  return _cached;
}
