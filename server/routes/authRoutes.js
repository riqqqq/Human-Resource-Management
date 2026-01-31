const express = require('express');
const router = express.Router();
const { login, verifyToken, authorizeRole } = require('../middlewares/auth');
const authController = require('../controllers/authController');

// Public routes
router.post('/login', login);
router.post('/register', authController.register);

// Protected routes
router.get('/users', verifyToken, authorizeRole(['admin']), authController.getAllUsers);
router.get('/users/pending', verifyToken, authorizeRole(['admin']), authController.getPendingUsers);
router.put('/users/:id/approve', verifyToken, authorizeRole(['admin']), authController.approveUser);
router.put('/users/:id/reject', verifyToken, authorizeRole(['admin']), authController.rejectUser);
router.delete('/users/:id', verifyToken, authorizeRole(['admin']), authController.deleteUser);

module.exports = router;
