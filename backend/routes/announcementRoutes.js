const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/', authenticate, authorize('admin'), announcementController.createAnnouncement);
router.get('/', announcementController.getAnnouncements);
router.get('/:id', announcementController.getAnnouncement);
router.put('/:id', authenticate, authorize('admin'), announcementController.updateAnnouncement);
router.delete('/:id', authenticate, authorize('admin'), announcementController.deleteAnnouncement);

module.exports = router;