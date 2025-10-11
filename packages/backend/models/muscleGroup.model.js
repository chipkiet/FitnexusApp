// packages/backend/models/muscleGroup.model.js
export default function defineMuscleGroup(sequelize, DataTypes) {
  const MuscleGroup = sequelize.define(
    "MuscleGroup",
    {
      muscle_group_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING(100),
      name_en: DataTypes.STRING(100),
      slug: DataTypes.STRING(100),
      description: DataTypes.TEXT,
    },
    { tableName: "muscle_groups", timestamps: false }
  );
  return MuscleGroup;
}
