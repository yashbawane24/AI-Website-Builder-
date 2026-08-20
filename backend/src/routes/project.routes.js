// ============================================
// Project Routes
// ============================================

const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/project.controller');

const router = Router();

router.use(authenticate);

router.get('/', ctrl.getProjects);
router.post('/', ctrl.createProject);
router.get('/:id', ctrl.getProject);
router.put('/:id', ctrl.updateProject);
router.delete('/:id', ctrl.deleteProject);
router.post('/:id/duplicate', ctrl.duplicateProject);
router.put('/:id/favorite', ctrl.toggleFavorite);
router.put('/:id/archive', ctrl.toggleArchive);
router.get('/:id/download', ctrl.downloadProject);
router.get('/:id/versions', ctrl.getVersions);
router.post('/:id/versions/:versionId/restore', ctrl.restoreVersion);

module.exports = router;
