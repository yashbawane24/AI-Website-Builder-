// ============================================
// Template Controller
// ============================================

const prisma = require('../config/database');
const { success, error } = require('../utils/apiResponse');

const getTemplates = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { isActive: true };
    if (category) where.category = category;

    const templates = await prisma.template.findMany({
      where,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, category: true, description: true, prompt: true, thumbnail: true },
    });
    return success(res, templates);
  } catch (err) { next(err); }
};

const getTemplate = async (req, res, next) => {
  try {
    const template = await prisma.template.findUnique({ where: { id: req.params.id } });
    if (!template) return error(res, 'Template not found', 404);
    return success(res, template);
  } catch (err) { next(err); }
};

module.exports = { getTemplates, getTemplate };
