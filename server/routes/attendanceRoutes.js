const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken } = require('../middlewares/auth');

// All routes require authentication
router.use(verifyToken);

// GET /api/attendance - Get attendance list for date
router.get('/', attendanceController.getByDate);

const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'attendance-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// POST /api/attendance - Record attendance with optional photo
router.post('/', upload.single('photo'), attendanceController.record);

// GET /api/attendance/employee/:id - Get attendance by employee
router.get('/employee/:id', attendanceController.getByEmployee);

// PUT /api/attendance/:id/status - Update attendance status
router.put('/:id/status', attendanceController.updateStatus);

module.exports = router;

