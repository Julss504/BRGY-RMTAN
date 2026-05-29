const express = require('express');
const router = express.Router();
const documentRequestController = require('../controllers/documentRequestController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/', authenticate, documentRequestController.createDocumentRequest);
router.get('/', authenticate, authorize('admin'), documentRequestController.getAllDocumentRequests);
router.get('/archived', authenticate, authorize('admin'), documentRequestController.getArchivedDocumentRequests);
router.get('/my-requests', authenticate, documentRequestController.getMyDocumentRequests);
router.get('/:id', authenticate, documentRequestController.getDocumentRequest);
router.put('/:id/status', authenticate, authorize('admin'), documentRequestController.updateDocumentRequest);
router.delete('/:id', authenticate, authorize('admin'), documentRequestController.archiveDocumentRequest);
router.put('/:id/restore', authenticate, authorize('admin'), documentRequestController.restoreDocumentRequest);

module.exports = router;