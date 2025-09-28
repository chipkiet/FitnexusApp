// models/initModels.js
import User from "./user.model.js";
import PasswordReset from "./passwordReset.model.js";
import OnboardingStep from "./onboarding.step.model.js";
import OnboardingField from "./onboarding.field.model.js";
import OnboardingSession from "./onboarding.session.model.js";
import OnboardingAnswer from "./onboarding.answer.model.js";

export function initModels() {
  // Khai báo quan hệ 1-n: User hasMany PasswordReset
  User.hasMany(PasswordReset, {
    foreignKey: "user_id",
    sourceKey: "user_id",
    onDelete: "CASCADE",
  });

  // PasswordReset belongsTo User
  PasswordReset.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "user_id",
    onDelete: "CASCADE",
  });

  // Onboarding relations
  // Steps ↔ Fields
  OnboardingStep.hasMany(OnboardingField, { foreignKey: 'step_id', sourceKey: 'step_id', as: 'fields' });
  OnboardingField.belongsTo(OnboardingStep, { foreignKey: 'step_id', targetKey: 'step_id', as: 'step' });

  // User ↔ Sessions
  User.hasMany(OnboardingSession, { foreignKey: 'user_id', sourceKey: 'user_id', as: 'onboardingSessions' });
  OnboardingSession.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id', as: 'user' });

  // Sessions ↔ Answers
  OnboardingSession.hasMany(OnboardingAnswer, { foreignKey: 'session_id', sourceKey: 'session_id', as: 'answers' });
  OnboardingAnswer.belongsTo(OnboardingSession, { foreignKey: 'session_id', targetKey: 'session_id', as: 'session' });

  // Steps ↔ Answers
  OnboardingStep.hasMany(OnboardingAnswer, { foreignKey: 'step_id', sourceKey: 'step_id', as: 'answers' });
  OnboardingAnswer.belongsTo(OnboardingStep, { foreignKey: 'step_id', targetKey: 'step_id', as: 'step' });

  // Trả ra để dùng nếu bạn muốn
  return {
    User,
    PasswordReset,
    OnboardingStep,
    OnboardingField,
    OnboardingSession,
    OnboardingAnswer,
  };
}
