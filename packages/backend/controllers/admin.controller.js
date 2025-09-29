// packages/backend/controllers/admin.controller.js
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from '../models/user.model.js';
import PasswordReset from '../models/passwordReset.model.js';

/**
 * GET /api/admin/users
 * Query: limit, offset, search, plan(FREE|PREMIUM), role(USER|TRAINER|ADMIN)
 */
export async function listUsers(req, res) {
  try {
    const limitRaw = parseInt(req.query.limit ?? '50', 10);
    const offsetRaw = parseInt(req.query.offset ?? '0', 10);
    const limit = Math.min(Math.max(1, isNaN(limitRaw) ? 50 : limitRaw), 200);
    const offset = Math.max(0, isNaN(offsetRaw) ? 0 : offsetRaw);

    const search = String(req.query.search ?? '').trim();
    const planRaw = String(req.query.plan ?? '').trim().toUpperCase();
    const roleRaw = String(req.query.role ?? '').trim().toUpperCase();

    const where = {};

    // Postgres hỗ trợ Op.iLike (case-insensitive). Nếu dùng dialect khác, đổi sang Op.like.
    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (['FREE', 'PREMIUM'].includes(planRaw)) where.plan = planRaw;
    if (['USER', 'TRAINER', 'ADMIN'].includes(roleRaw)) where.role = roleRaw;

    const { rows, count } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: [
        'user_id',
        'username',
        'email',
        'role',
        'plan',
        'status',
        'lastLoginAt',
        'created_at',
        'updated_at',
      ],
    });

    return res.json({
      success: true,
      data: { items: rows, total: count, limit, offset },
    });
  } catch (err) {
    console.error('Admin listUsers error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * PATCH /api/admin/users/:id/role
 * Body: { role: 'USER'|'TRAINER'|'ADMIN' }
 */
export async function updateUserRole(req, res) {
  try {
    const userId = req.params.id;
    const nextRole = String(req.body.role ?? '').trim().toUpperCase();

    if (!['USER', 'TRAINER', 'ADMIN'].includes(nextRole)) {
      return res.status(422).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = nextRole;
    await user.save({ fields: ['role'] });

    return res.json({
      success: true,
      message: 'Role updated',
      data: {
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
          plan: user.plan,
          status: user.status,
          updated_at: user.updated_at,
        },
      },
    });
  } catch (err) {
    console.error('Admin updateUserRole error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * PATCH /api/admin/users/:id/plan
 * Body: { plan: 'FREE'|'PREMIUM' }
 */
export async function updateUserPlan(req, res) {
  try {
    const userId = req.params.id;
    const nextPlan = String(req.body.plan ?? '').trim().toUpperCase();

    if (!['FREE', 'PREMIUM'].includes(nextPlan)) {
      return res.status(422).json({ success: false, message: 'Invalid plan' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.plan = nextPlan;
    await user.save({ fields: ['plan'] });

    return res.json({
      success: true,
      message: 'Plan updated',
      data: {
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
          plan: user.plan,
          status: user.status,
          updated_at: user.updated_at,
        },
      },
    });
  } catch (err) {
    console.error('Admin updateUserPlan error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * POST /api/admin/users/:userId/reset-password
 * Body: { newPassword, confirmPassword }
 * Yêu cầu: middleware auth đã gắn req.user và check role ADMIN ở routes.
 */
export async function resetPassword(req, res) {
  try {
    const { userId } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'newPassword & confirmPassword are required' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // policy nhanh (nếu bạn có lib/passwordValidation.js thì tái sử dụng cho đồng nhất)
    const strong =
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /\d/.test(newPassword) &&
      /[\W_]/.test(newPassword);

    if (!strong) {
      return res.status(400).json({
        success: false,
        message: 'Password too weak (min 8, cần chữ hoa, chữ thường, số, ký tự đặc biệt)',
      });
    }

    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: { user_id: Number(userId) },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!user) return { ok: false, message: 'User not found' };

      // DÙNG HOOK của model để hash (beforeUpdate đã có):
      user.set('passwordHash', newPassword);
      user.changed('passwordHash', true);
      await user.save({ transaction: t });
      // Log vào bảng password_resets
      await PasswordReset.create(
        {
          user_id: Number(userId),
          token_hash: 'ADMIN_RESET',
          expires_at: sequelize.fn('NOW'),
          used_at: sequelize.fn('NOW'),
          created_at: sequelize.fn('NOW'),
        },
        { transaction: t }
      );

      // (tuỳ chọn) nếu bạn có token_version ở bảng users, tăng +1 để force logout các phiên cũ
      // await user.increment('token_version', { by: 1, transaction: t });

      return { ok: true };
    });

    if (!result.ok) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error('Admin resetPassword error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
