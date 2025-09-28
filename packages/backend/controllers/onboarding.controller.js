import OnboardingStep from "../models/onboarding.step.model.js";
import OnboardingField from "../models/onboarding.field.model.js";
import OnboardingAnswer from "../models/onboarding.answer.model.js";
import OnboardingSession from "../models/onboarding.session.model.js";
import User from "../models/user.model.js";
import { sequelize } from "../config/database.js";
import { Op } from "sequelize";

// Helper: fetch step by key with fields
async function getStepByKeyWithFields(stepKey) {
  const step = await OnboardingStep.findOne({
    where: { step_key: stepKey, is_active: true },
    order: [["order_index", "ASC"]],
  });
  if (!step) return null;
  const fields = await OnboardingField.findAll({
    where: { step_id: step.step_id },
    order: [["order_index", "ASC"], ["field_id", "ASC"]],
  });
  return { step, fields };
}

// Helper: find/create active session for user
async function findOrCreateActiveSession(userId) {
  let session = await OnboardingSession.findOne({
    where: { user_id: userId, is_completed: false },
    order: [["created_at", "DESC"]],
  });
  if (!session) {
    session = await OnboardingSession.create({ user_id: userId });
  }
  return session;
}

// GET /api/onboarding/steps/:key
export async function getStep(req, res) {
  try {
    const { key } = req.params;
    const data = await getStepByKeyWithFields(key);
    if (!data) return res.status(404).json({ success: false, message: "Step not found" });

    const { step, fields } = data;
    return res.json({
      success: true,
      data: {
        step: {
          step_id: step.step_id,
          step_key: step.step_key,
          title: step.title,
          order_index: step.order_index,
        },
        fields: fields.map((f) => ({
          field_id: f.field_id,
          step_id: f.step_id,
          field_key: f.field_key,
          label: f.label,
          input_type: f.input_type,
          required: f.required,
          order_index: f.order_index,
          metadata: f.metadata,
        })),
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("getStep error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// POST /api/onboarding/steps/:key/answer
// Body: { answers: {...} }
export async function saveAnswer(req, res) {
  const t = await sequelize.transaction();
  try {
    const userId = req.userId;
    const { key } = req.params;
    const { answers } = req.body || {};

    if (!answers || typeof answers !== "object") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "answers is required" });
    }

    // Step + fields
    const data = await getStepByKeyWithFields(key);
    if (!data) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Step not found" });
    }
    const { step, fields } = data;

    // Validate for specific step: age
    if (step.step_key === "age") {
      const ageField = fields.find((f) => f.field_key === "age_group");
      const opt = (ageField?.metadata?.options || []).map((o) => String(o.key));
      const chosen = String(answers?.age_group || "");
      if (!chosen || !opt.includes(chosen)) {
        await t.rollback();
        return res.status(422).json({ success: false, message: "Invalid age_group option" });
      }
    }

    // Session
    const session = await findOrCreateActiveSession(userId);
    // Upsert answer per (session, step)
    const existing = await OnboardingAnswer.findOne({
      where: { session_id: session.session_id, step_id: step.step_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (existing) {
      await existing.update({ answers }, { transaction: t });
    } else {
      await OnboardingAnswer.create(
        { session_id: session.session_id, step_id: step.step_id, answers },
        { transaction: t }
      );
    }

    // Determine next step by order_index
    const next = await OnboardingStep.findOne({
      where: { is_active: true, order_index: { [Op.gt]: step.order_index } },
      order: [["order_index", "ASC"]],
      transaction: t,
    });

    if (next) {
      await session.update({ current_step_key: next.step_key }, { transaction: t });
    } else {
      // Finish session and mark user onboarded
      await session.update({ is_completed: true, completed_at: new Date() }, { transaction: t });
      const user = await User.findByPk(userId, { transaction: t });
      if (user) {
        await user.update({ onboardingCompletedAt: new Date() }, { transaction: t });
      }
    }

    await t.commit();
    return res.json({
      success: true,
      message: "Saved",
      data: {
        session_id: session.session_id,
        nextStepKey: next ? next.step_key : null,
        completed: !next,
      },
    });
  } catch (err) {
    await t.rollback();
    // eslint-disable-next-line no-console
    console.error("saveAnswer error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// GET /api/onboarding/session
// Returns overall onboarding status for the current user
export async function getSessionStatus(req, res) {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);

    // If user has completed flag -> not required
    if (user?.onboardingCompletedAt) {
      return res.json({
        success: true,
        data: {
          required: false,
          completed: true,
          sessionId: null,
          currentStepKey: null,
          nextStepKey: null,
          completedAt: user.onboardingCompletedAt,
        },
      });
    }

    // Try to find an active session
    let session = await OnboardingSession.findOne({
      where: { user_id: userId, is_completed: false },
      order: [["created_at", "DESC"]],
    });

    // Determine first step
    const firstStep = await OnboardingStep.findOne({
      where: { is_active: true },
      order: [["order_index", "ASC"]],
    });

    if (!session) {
      // Check if any completed session exists (fallback)
      const completedSession = await OnboardingSession.findOne({
        where: { user_id: userId, is_completed: true },
        order: [["completed_at", "DESC"]],
      });
      if (completedSession) {
        return res.json({
          success: true,
          data: {
            required: false,
            completed: true,
            sessionId: completedSession.session_id,
            currentStepKey: null,
            nextStepKey: null,
            completedAt: completedSession.completed_at,
          },
        });
      }

      // Otherwise, create a new session and set current to first step
      session = await OnboardingSession.create({
        user_id: userId,
        current_step_key: firstStep ? firstStep.step_key : null,
      });
    }

    const nextKey = session.current_step_key || (firstStep ? firstStep.step_key : null);
    return res.json({
      success: true,
      data: {
        required: true,
        completed: false,
        sessionId: session.session_id,
        currentStepKey: session.current_step_key,
        nextStepKey: nextKey,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("getSessionStatus error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
