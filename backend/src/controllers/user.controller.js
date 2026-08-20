// ============================================
// User Controller
// ============================================

const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { success, error } = require('../utils/apiResponse');
const multer = require('multer');
const path = require('path');

// Avatar upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    cb(valid ? null : new Error('Only image files are allowed'), valid);
  },
}).single('avatar');

/** GET /api/users/profile */
const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, avatar: true, role: true, credits: true,
        emailVerified: true, theme: true, language: true, notifyEmail: true,
        notifyBrowser: true, createdAt: true,
        _count: { select: { projects: true, payments: true } },
        subscriptions: { where: { status: 'ACTIVE' }, take: 1, select: { plan: true, currentPeriodEnd: true } },
      },
    });
    return success(res, { ...user, subscription: user.subscriptions[0] || { plan: 'FREE' } });
  } catch (err) { next(err); }
};

/** PUT /api/users/profile */
const updateProfile = async (req, res, next) => {
  try {
    const { name, theme, language, notifyEmail, notifyBrowser } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(theme !== undefined && { theme }),
        ...(language !== undefined && { language }),
        ...(notifyEmail !== undefined && { notifyEmail }),
        ...(notifyBrowser !== undefined && { notifyBrowser }),
      },
      select: { id: true, name: true, email: true, avatar: true, theme: true, language: true, notifyEmail: true, notifyBrowser: true },
    });
    return success(res, user, 'Profile updated');
  } catch (err) { next(err); }
};

/** PUT /api/users/password */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return error(res, 'Current password is incorrect', 400);

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    return success(res, null, 'Password updated');
  } catch (err) { next(err); }
};

/** POST /api/users/avatar */
const uploadAvatar = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return error(res, err.message, 400);
    if (!req.file) return error(res, 'No file uploaded', 400);

    try {
      const avatarUrl = `/uploads/${req.file.filename}`;
      await prisma.user.update({ where: { id: req.user.id }, data: { avatar: avatarUrl } });
      return success(res, { avatar: avatarUrl }, 'Avatar updated');
    } catch (e) { next(e); }
  });
};

/** DELETE /api/users/account */
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return error(res, 'Password is incorrect', 400);

    await prisma.user.delete({ where: { id: req.user.id } });
    return success(res, null, 'Account deleted');
  } catch (err) { next(err); }
};

/** GET /api/users/stats */
const getStats = async (req, res, next) => {
  try {
    const [projectCount, creditTx, promptCount] = await Promise.all([
      prisma.project.count({ where: { userId: req.user.id } }),
      prisma.creditTransaction.aggregate({ where: { userId: req.user.id, type: 'USAGE' }, _sum: { amount: true } }),
      prisma.promptHistory.count({ where: { userId: req.user.id } }),
    ]);
    return success(res, {
      totalProjects: projectCount,
      totalAiRequests: promptCount,
      totalCreditsUsed: Math.abs(creditTx._sum.amount || 0),
    });
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, changePassword, uploadAvatar, deleteAccount, getStats };
