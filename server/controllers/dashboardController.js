const Employee = require('../models/employeeModel');
const Attendance = require('../models/attendanceModel');

const dashboardController = {
    // GET /dashboard/stats - Get dashboard statistics
    async getStats(req, res) {
        try {
            // Get total active employees
            const totalEmployees = await Employee.count();
            
            // Get total present today
            const presentToday = await Attendance.countPresentToday();
            
            // Calculate absent (total - present)
            const absentToday = totalEmployees - presentToday;

            res.json({
                success: true,
                data: {
                    totalEmployees,
                    presentToday,
                    absentToday: absentToday < 0 ? 0 : absentToday
                }
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard statistics',
                error: error.message
            });
        }
    }
};

module.exports = dashboardController;
