// ============================================
// Project Controller
// ============================================

const prisma = require('../config/database');
const { success, error, paginated } = require('../utils/apiResponse');
const archiver = require('archiver');

/** GET /api/projects */
const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 12, search, status, favorite, archived, sort = 'updatedAt' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { userId };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (favorite === 'true') where.isFavorite = true;
    if (archived === 'true') where.isArchived = true;
    else where.isArchived = false;

    const orderBy = sort === 'name' ? { name: 'asc' } : { updatedAt: 'desc' };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({ where, orderBy, skip, take: parseInt(limit), select: {
        id: true, name: true, prompt: true, status: true, isFavorite: true, isArchived: true,
        thumbnail: true, createdAt: true, updatedAt: true,
        template: { select: { name: true, category: true } },
      }}),
      prisma.project.count({ where }),
    ]);

    return paginated(res, projects, total, parseInt(page), parseInt(limit));
  } catch (err) { next(err); }
};

/** GET /api/projects/:id */
const getProject = async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        versions: { orderBy: { version: 'desc' }, take: 20 },
        prompts: { orderBy: { createdAt: 'desc' }, take: 10 },
        template: true,
      },
    });
    if (!project) return error(res, 'Project not found', 404);
    return success(res, project);
  } catch (err) { next(err); }
};

/** POST /api/projects */
const createProject = async (req, res, next) => {
  try {
    const { name, description, prompt } = req.body;
    const project = await prisma.project.create({
      data: { userId: req.user.id, name, description, prompt: prompt || '' },
    });
    return success(res, project, 'Project created', 201);
  } catch (err) { next(err); }
};

/** PUT /api/projects/:id */
const updateProject = async (req, res, next) => {
  try {
    const { name, description, htmlCode, cssCode, jsCode, reactCode } = req.body;
    const existing = await prisma.project.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return error(res, 'Project not found', 404);

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(htmlCode !== undefined && { htmlCode }),
        ...(cssCode !== undefined && { cssCode }),
        ...(jsCode !== undefined && { jsCode }),
        ...(reactCode !== undefined && { reactCode }),
      },
    });
    return success(res, project, 'Project updated');
  } catch (err) { next(err); }
};

/** DELETE /api/projects/:id */
const deleteProject = async (req, res, next) => {
  try {
    const existing = await prisma.project.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return error(res, 'Project not found', 404);
    await prisma.project.delete({ where: { id: req.params.id } });
    return success(res, null, 'Project deleted');
  } catch (err) { next(err); }
};

/** POST /api/projects/:id/duplicate */
const duplicateProject = async (req, res, next) => {
  try {
    const original = await prisma.project.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!original) return error(res, 'Project not found', 404);
    const project = await prisma.project.create({
      data: {
        userId: req.user.id, name: `${original.name} (Copy)`, prompt: original.prompt,
        htmlCode: original.htmlCode, cssCode: original.cssCode,
        jsCode: original.jsCode, reactCode: original.reactCode,
        status: original.status, templateId: original.templateId,
      },
    });
    return success(res, project, 'Project duplicated', 201);
  } catch (err) { next(err); }
};

/** PUT /api/projects/:id/favorite */
const toggleFavorite = async (req, res, next) => {
  try {
    const existing = await prisma.project.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return error(res, 'Project not found', 404);
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { isFavorite: !existing.isFavorite },
    });
    return success(res, project);
  } catch (err) { next(err); }
};

/** PUT /api/projects/:id/archive */
const toggleArchive = async (req, res, next) => {
  try {
    const existing = await prisma.project.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return error(res, 'Project not found', 404);
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { isArchived: !existing.isArchived },
    });
    return success(res, project);
  } catch (err) { next(err); }
};

/** GET /api/projects/:id/download */
const downloadProject = async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!project) return error(res, 'Project not found', 404);

    const format = req.query.format || 'html';
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/[^a-zA-Z0-9]/g, '_')}.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    if (format === 'react') {
      archive.append(project.reactCode || '', { name: 'src/App.jsx' });
      archive.append(project.cssCode || '', { name: 'src/App.css' });
      archive.append(JSON.stringify({ name: project.name, private: true, type: 'module', scripts: { dev: 'vite', build: 'vite build' }, dependencies: { react: '^18.3.0', 'react-dom': '^18.3.0' }, devDependencies: { vite: '^5.0.0', '@vitejs/plugin-react': '^4.0.0' } }, null, 2), { name: 'package.json' });
    } else {
      archive.append(project.htmlCode || '', { name: 'index.html' });
      archive.append(project.cssCode || '', { name: 'styles.css' });
      archive.append(project.jsCode || '', { name: 'script.js' });
    }

    archive.append(`# ${project.name}\n\nGenerated by AI Website Builder\n\nPrompt: ${project.prompt}`, { name: 'README.md' });
    await archive.finalize();
  } catch (err) { next(err); }
};

/** GET /api/projects/:id/versions */
const getVersions = async (req, res, next) => {
  try {
    const versions = await prisma.versionHistory.findMany({
      where: { projectId: req.params.id },
      orderBy: { version: 'desc' },
    });
    return success(res, versions);
  } catch (err) { next(err); }
};

/** POST /api/projects/:id/versions/:versionId/restore */
const restoreVersion = async (req, res, next) => {
  try {
    const version = await prisma.versionHistory.findUnique({ where: { id: req.params.versionId } });
    if (!version) return error(res, 'Version not found', 404);

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { htmlCode: version.htmlCode, cssCode: version.cssCode, jsCode: version.jsCode, reactCode: version.reactCode },
    });
    return success(res, project, 'Version restored');
  } catch (err) { next(err); }
};

module.exports = {
  getProjects, getProject, createProject, updateProject, deleteProject,
  duplicateProject, toggleFavorite, toggleArchive, downloadProject,
  getVersions, restoreVersion,
};
