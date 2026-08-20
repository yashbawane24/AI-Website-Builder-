// ============================================
// Generate Controller
// ============================================

const prisma = require('../config/database');
const { success, error } = require('../utils/apiResponse');
const { generateWebsite } = require('../services/ai/index');
const { hasEnoughCredits, deductCredits } = require('../services/credit.service');

const GENERATION_COST = 2;

/**
 * POST /api/generate
 */
const generate = async (req, res, next) => {
  try {
    const { prompt, template, style, sections, projectName } = req.body;
    const userId = req.user.id;

    // Check credits
    const enough = await hasEnoughCredits(userId, GENERATION_COST);
    if (!enough) {
      return error(res, 'Insufficient credits. Please purchase more credits to continue.', 402);
    }

    // Generate website via AI
    const generated = await generateWebsite(prompt, { template, style, sections });

    // Create project
    const project = await prisma.project.create({
      data: {
        userId,
        name: projectName || `Project ${Date.now()}`,
        prompt,
        htmlCode: generated.html,
        cssCode: generated.css,
        jsCode: generated.js,
        reactCode: generated.react,
        status: 'GENERATED',
      },
    });

    // Deduct credits
    await deductCredits(userId, GENERATION_COST, 'Website generation', project.id);

    // Save prompt history
    await prisma.promptHistory.create({
      data: { userId, projectId: project.id, prompt },
    });

    // Save initial version
    await prisma.versionHistory.create({
      data: {
        projectId: project.id,
        version: 1,
        htmlCode: generated.html,
        cssCode: generated.css,
        jsCode: generated.js,
        reactCode: generated.react,
        label: 'Initial generation',
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'GENERATE_WEBSITE',
        metadata: { projectId: project.id, prompt: prompt.substring(0, 200) },
      },
    });

    return success(res, { project }, 'Website generated successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/generate/regenerate/:projectId
 */
const regenerate = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { prompt } = req.body;
    const userId = req.user.id;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) return error(res, 'Project not found', 404);

    const enough = await hasEnoughCredits(userId, GENERATION_COST);
    if (!enough) return error(res, 'Insufficient credits', 402);

    const generated = await generateWebsite(prompt || project.prompt);

    // Get current max version
    const lastVersion = await prisma.versionHistory.findFirst({
      where: { projectId },
      orderBy: { version: 'desc' },
    });

    const newVersion = (lastVersion?.version || 0) + 1;

    // Update project
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        htmlCode: generated.html,
        cssCode: generated.css,
        jsCode: generated.js,
        reactCode: generated.react,
        prompt: prompt || project.prompt,
      },
    });

    // Save version
    await prisma.versionHistory.create({
      data: {
        projectId,
        version: newVersion,
        htmlCode: generated.html,
        cssCode: generated.css,
        jsCode: generated.js,
        reactCode: generated.react,
        label: `Regeneration v${newVersion}`,
      },
    });

    await deductCredits(userId, GENERATION_COST, 'Website regeneration', projectId);

    await prisma.promptHistory.create({
      data: { userId, projectId, prompt: prompt || project.prompt },
    });

    return success(res, { project: updated }, 'Website regenerated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { generate, regenerate };
