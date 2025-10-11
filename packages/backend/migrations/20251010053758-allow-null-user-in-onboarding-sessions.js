// Migration: allow null user_id in onboarding_sessions to support anonymous onboarding

export async function up(queryInterface, Sequelize) {
  // Relax NOT NULL -> NULL on user_id
  await queryInterface.changeColumn('onboarding_sessions', 'user_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    // keep existing FK reference; Postgres will retain the same constraint behavior
    references: { model: 'users', key: 'user_id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
}

export async function down(queryInterface, Sequelize) {
  // Revert to NOT NULL (will fail if null values exist)
  await queryInterface.changeColumn('onboarding_sessions', 'user_id', {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'user_id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
}