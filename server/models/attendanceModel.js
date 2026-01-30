const { pool } = require('../config/db');

const Attendance = {
    // Get attendance by date (default: today)
    async findByDate(date = null) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const [rows] = await pool.query(
            `SELECT a.*, e.name as employee_name, e.nik, e.position 
             FROM attendance a 
             JOIN employees e ON a.employee_id = e.id 
             WHERE a.date = ? 
             ORDER BY a.time_in DESC`,
            [targetDate]
        );
        return rows;
    },

    // Get attendance by employee
    async findByEmployee(employeeId) {
        const [rows] = await pool.query(
            `SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC`,
            [employeeId]
        );
        return rows;
    },

    // Check if attendance exists for employee on specific date
    async findByEmployeeAndDate(employeeId, date) {
        const [rows] = await pool.query(
            'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
            [employeeId, date]
        );
        return rows[0];
    },

    // Create attendance (clock in)
    async clockIn(data) {
        const { employee_id, date, time_in } = data;
        const [result] = await pool.query(
            'INSERT INTO attendance (employee_id, date, time_in) VALUES (?, ?, ?)',
            [employee_id, date, time_in]
        );
        return { id: result.insertId, ...data };
    },

    // Update attendance (clock out)
    async clockOut(id, time_out) {
        const [result] = await pool.query(
            'UPDATE attendance SET time_out = ? WHERE id = ?',
            [time_out, id]
        );
        return result.affectedRows > 0;
    },

    // Create or update attendance
    async upsert(data) {
        const { employee_id, date, time_in, time_out, image_path, status } = data;
        
        // Check if exists
        const existing = await this.findByEmployeeAndDate(employee_id, date);
        
        if (existing) {
            // Update existing record
            const [result] = await pool.query(
                'UPDATE attendance SET time_in = ?, time_out = ?, image_path = COALESCE(?, image_path), status = COALESCE(?, status) WHERE id = ?',
                [time_in || existing.time_in, time_out || existing.time_out, image_path, status, existing.id]
            );
            return { id: existing.id, updated: true };
        } else {
            // Create new record
            const [result] = await pool.query(
                'INSERT INTO attendance (employee_id, date, time_in, time_out, image_path, status) VALUES (?, ?, ?, ?, ?, ?)',
                [employee_id, date, time_in, time_out, image_path, status || 'pending']
            );
            return { id: result.insertId, created: true };
        }
    },

    // Count approved present today
    async countPresentToday() {
        const today = new Date().toLocaleDateString('en-CA');
        const [rows] = await pool.query(
            'SELECT COUNT(DISTINCT employee_id) as total FROM attendance WHERE date = ? AND status = "approved"',
            [today]
        );
        return rows[0].total;
    }
};

module.exports = Attendance;
