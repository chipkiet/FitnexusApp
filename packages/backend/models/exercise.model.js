// packages/backend/models/exercise.model.js
export default function defineExercise(sequelize, DataTypes) {
  const Exercise = sequelize.define(
    "Exercise",
    {
      exercise_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING(255),
      name_en: DataTypes.STRING(255),
      slug: DataTypes.STRING(255),
      description: DataTypes.TEXT,
    },
    { tableName: "exercises", timestamps: false }
  );
  return Exercise;
}