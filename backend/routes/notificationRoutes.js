const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', authenticate, notificationController.getMyNotifications);
router.post('/send', authenticate, authorize('admin'), notificationController.sendNotification);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.patch('/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

module.exports = router;