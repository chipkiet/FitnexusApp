// Force-drop NOT NULL on onboarding_sessions.user_id for Postgres

export async function up(queryInterface, Sequelize) {
  const dialect = queryInterface.sequelize.getDialect();
  if (dialect === 'postgres') {
    await queryInterface.sequelize.query(
      'ALTER TABLE "onboarding_sessions" ALTER COLUMN "user_id" DROP NOT NULL;'
    );
  } else {
    // Fallback to changeColumn for other dialects
    await queryInterface.changeColumn('onboarding_sessions', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
}

export async function down(queryInterface, Sequelize) {
  const dialect = queryInterface.sequelize.getDialect();
  if (dialect === 'postgres') {
    await queryInterface.sequelize.query(
      'ALTER TABLE "onboarding_sessions" ALTER COLUMN "user_id" SET NOT NULL;'
    );
  } else {
    await queryInterface.changeColumn('onboarding_sessions', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
}