// packages/backend/models/exerciseMuscleGroup.model.js
export default function defineExerciseMuscleGroup(sequelize, DataTypes) {
  const ExerciseMuscleGroup = sequelize.define(
    "ExerciseMuscleGroup",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      exercise_id: DataTypes.INTEGER,
      muscle_group_id: DataTypes.INTEGER,
      impact_level: DataTypes.STRING(20),
      intensity_percentage: DataTypes.INTEGER,
      activation_note: DataTypes.TEXT,
      created_at: DataTypes.DATE,
    },
    { tableName: "exercise_muscle_group", timestamps: false }
  );
  return ExerciseMuscleGroup;
}
