const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);
router.get('/users', authenticate, authorize('admin'), authController.getAllUsers);
router.put('/users/:id/status', authenticate, authorize('admin'), authController.updateUserStatus);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;