import { Op } from 'sequelize';
import User from '../models/user.model.js';

export async function listUsers(req, res) {
  try {
    const limit = req.query.limit || 50;
    const offset = req.query.offset || 0;
    const search = req.query.search || '';

    const where = {};
    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

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

    return res.json({ success: true, data: { items: rows, total: count, limit, offset } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Admin listUsers error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateUserRole(req, res) {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
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
    // eslint-disable-next-line no-console
    console.error('Admin updateUserRole error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

