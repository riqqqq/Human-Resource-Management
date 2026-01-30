const Attendance = require('../models/attendanceModel');
const Employee = require('../models/employeeModel');

const attendanceController = {
    // GET /attendance - Get attendance list (default: today)
    async getByDate(req, res) {
        try {
            const { date } = req.query;
            const attendanceList = await Attendance.findByDate(date);
            
            res.json({
                success: true,
                data: attendanceList
            });
        } catch (error) {
            console.error('Error fetching attendance:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch attendance',
                error: error.message
            });
        }
    },

    // POST /attendance - Record attendance (clock in/out)
    async record(req, res) {
        try {
            const { employee_id, date, time_in, time_out } = req.body;
            const image_path = req.file ? `/uploads/${req.file.filename}` : null;

            // Validation
            if (!employee_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Employee ID is required'
                });
            }

            // Check if employee exists
            const employee = await Employee.findById(employee_id);
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            // Use today's date if not provided
            const attendanceDate = date || new Date().toISOString().split('T')[0];

            const result = await Attendance.upsert({
                employee_id,
                date: attendanceDate,
                time_in,
                time_out,
                image_path,
                status: time_in ? 'pending' : undefined // Only reset to pending for new clock-ins/re-clock-ins
            });

            res.status(result.created ? 201 : 200).json({
                success: true,
                message: result.created ? 'Attendance recorded' : 'Attendance updated',
                data: result
            });
        } catch (error) {
            console.error('Error recording attendance:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to record attendance',
                error: error.message
            });
        }
    },

    // GET /attendance/employee/:id - Get attendance by employee
    async getByEmployee(req, res) {
        try {
            const { id } = req.params;
            const attendanceList = await Attendance.findByEmployee(id);
            
            res.json({
                success: true,
                data: attendanceList
            });
        } catch (error) {
            console.error('Error fetching employee attendance:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch employee attendance',
                error: error.message
            });
        }
    },

    // PUT /attendance/:id/status - Update attendance status (approve/reject)
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['approved', 'rejected'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
            }

            const [result] = await require('../config/db').pool.query(
                'UPDATE attendance SET status = ? WHERE id = ?',
                [status, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Attendance record not found'
                });
            }

            res.json({
                success: true,
                message: `Attendance ${status}`
            });
        } catch (error) {
            console.error('Error updating status:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update status',
                error: error.message
            });
        }
    }
};

module.exports = attendanceController;
