// ============================================
// Admin Controller
// ============================================

const prisma = require('../config/database');
const { success, error, paginated } = require('../utils/apiResponse');

/** GET /api/admin/stats */
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProjects, totalRevenue, totalAiRequests] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      prisma.promptHistory.count(),
    ]);

    // Recent user growth (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });

    return success(res, {
      totalUsers,
      totalProjects,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalAiRequests,
      newUsersLast30Days: newUsers,
    });
  } catch (err) { next(err); }
};

/** GET /api/admin/users */
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, role: true, credits: true,
          emailVerified: true, createdAt: true,
          _count: { select: { projects: true } },
          subscriptions: { where: { status: 'ACTIVE' }, take: 1, select: { plan: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return paginated(res, users, total, parseInt(page), parseInt(limit));
  } catch (err) { next(err); }
};

/** PUT /api/admin/users/:id */
const updateUser = async (req, res, next) => {
  try {
    const { role, credits } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(role !== undefined && { role }),
        ...(credits !== undefined && { credits }),
      },
      select: { id: true, name: true, email: true, role: true, credits: true },
    });
    return success(res, user, 'User updated');
  } catch (err) { next(err); }
};

/** GET /api/admin/payments */
const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip, take: parseInt(limit), orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.payment.count(),
    ]);

    return paginated(res, payments, total, parseInt(page), parseInt(limit));
  } catch (err) { next(err); }
};

/** Admin template CRUD */
const createTemplate = async (req, res, next) => {
  try {
    const template = await prisma.template.create({ data: req.body });
    return success(res, template, 'Template created', 201);
  } catch (err) { next(err); }
};

const updateTemplate = async (req, res, next) => {
  try {
    const template = await prisma.template.update({ where: { id: req.params.id }, data: req.body });
    return success(res, template, 'Template updated');
  } catch (err) { next(err); }
};

const deleteTemplate = async (req, res, next) => {
  try {
    await prisma.template.delete({ where: { id: req.params.id } });
    return success(res, null, 'Template deleted');
  } catch (err) { next(err); }
};

module.exports = { getStats, getUsers, updateUser, getPayments, createTemplate, updateTemplate, deleteTemplate };
