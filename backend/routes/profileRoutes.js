const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/', authenticate, profileController.createProfile);
router.get('/me', authenticate, profileController.getProfile);
router.put('/me', authenticate, profileController.updateProfile);
router.get('/count', authenticate, authorize('admin'), profileController.getProfileCount);
router.get('/:userId', authenticate, authorize('admin'), profileController.getProfileByUserId);

module.exports = router;