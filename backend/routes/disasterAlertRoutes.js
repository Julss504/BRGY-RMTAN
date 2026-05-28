const express = require('express');
const router = express.Router();
const disasterAlertController = require('../controllers/disasterAlertController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/', authenticate, authorize('admin'), disasterAlertController.createDisasterAlert);
router.get('/', disasterAlertController.getDisasterAlerts);
router.get('/all', authenticate, authorize('admin'), disasterAlertController.getAllDisasterAlerts);
router.get('/:id', disasterAlertController.getDisasterAlert);
router.put('/:id', authenticate, authorize('admin'), disasterAlertController.updateDisasterAlert);
router.patch('/:id/deactivate', authenticate, authorize('admin'), disasterAlertController.deactivateAlert);

module.exports = router;