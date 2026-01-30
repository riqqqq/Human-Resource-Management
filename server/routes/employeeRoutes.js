const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, authorizeRole } = require('../middlewares/auth');

// All routes require authentication
router.use(verifyToken);

// GET /api/employees - Get all employees
router.get('/', employeeController.getAll);

// GET /api/employees/:id - Get employee by ID
router.get('/:id', employeeController.getById);

// POST /api/employees - Create new employee (admin only)
router.post('/', authorizeRole(['admin']), employeeController.create);

// PUT /api/employees/:id - Update employee (admin only)
router.put('/:id', authorizeRole(['admin']), employeeController.update);

// DELETE /api/employees/:id - Delete employee (admin only)
router.delete('/:id', authorizeRole(['admin']), employeeController.delete);

module.exports = router;

