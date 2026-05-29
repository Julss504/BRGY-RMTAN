const express = require('express');
const router = express.Router();
const wasteScheduleController = require('../controllers/wasteScheduleController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/', authenticate, authorize('admin'), wasteScheduleController.createWasteSchedule);
router.get('/', wasteScheduleController.getWasteSchedules);
router.get('/archived', authenticate, authorize('admin'), wasteScheduleController.getArchivedWasteSchedules);
router.get('/:id', wasteScheduleController.getWasteSchedule);
router.put('/:id', authenticate, authorize('admin'), wasteScheduleController.updateWasteSchedule);
router.delete('/:id', authenticate, authorize('admin'), wasteScheduleController.archiveWasteSchedule);
router.put('/:id/restore', authenticate, authorize('admin'), wasteScheduleController.restoreWasteSchedule);

module.exports = router;