// packages/backend/controllers/admin.controller.js
import { Op } from 'sequelize';
import User from '../models/user.model.js'; // đảm bảo đúng đường dẫn/export

// GET /api/admin/users
export async function listUsers(req, res) {
  try {
    // parse & sanitize
    const limitRaw = parseInt(req.query.limit ?? '50', 10);
    const offsetRaw = parseInt(req.query.offset ?? '0', 10);
    const limit = Math.min(Math.max(1, isNaN(limitRaw) ? 50 : limitRaw), 200);
    const offset = Math.max(0, isNaN(offsetRaw) ? 0 : offsetRaw);

    const search = String(req.query.search ?? '').trim();
    const planRaw = String(req.query.plan ?? '').trim().toUpperCase();
    const roleRaw = String(req.query.role ?? '').trim().toUpperCase();

    const where = {};

    // search theo username/email (Postgres: iLike = case-insensitive)
    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
      // Nếu dùng dialect khác, có thể đổi Op.iLike -> Op.like
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

// PATCH /api/admin/users/:id/role
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

// PATCH /api/admin/users/:id/plan
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
