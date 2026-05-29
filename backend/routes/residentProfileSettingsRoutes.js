const express = require('express');
const router = express.Router();
const residentProfileSettingsController = require('../controllers/residentProfileSettingsController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/', authenticate, residentProfileSettingsController.createProfileSettings);
router.get('/me', authenticate, residentProfileSettingsController.getProfileSettings);
router.put('/me', authenticate, residentProfileSettingsController.updateProfileSettings);
router.get('/count', authenticate, authorize('admin'), residentProfileSettingsController.getProfileSettingsCount);
router.get('/:userId', authenticate, authorize('admin'), residentProfileSettingsController.getProfileSettingsByUserId);

module.exports = router;