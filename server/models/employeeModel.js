const { pool } = require('../config/db');

const Employee = {
    // Get all employees
    async findAll() {
        const [rows] = await pool.query(
            'SELECT * FROM employees ORDER BY created_at DESC'
        );
        return rows;
    },

    // Get employee by ID
    async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Get employee by NIK
    async findByNik(nik) {
        const [rows] = await pool.query(
            'SELECT * FROM employees WHERE nik = ?',
            [nik]
        );
        return rows[0];
    },

    // Create new employee
    async create(data) {
        const { nik, name, position, join_date, salary = 0, status = 'active' } = data;
        const [result] = await pool.query(
            'INSERT INTO employees (nik, name, position, join_date, salary, status) VALUES (?, ?, ?, ?, ?, ?)',
            [nik, name, position, join_date, salary, status]
        );
        return { id: result.insertId, ...data };
    },

    // Update employee
    async update(id, data) {
        const { nik, name, position, join_date, salary, status } = data;
        const [result] = await pool.query(
            'UPDATE employees SET nik = ?, name = ?, position = ?, join_date = ?, salary = ?, status = ? WHERE id = ?',
            [nik, name, position, join_date, salary, status, id]
        );
        return result.affectedRows > 0;
    },

    // Delete employee
    async delete(id) {
        const [result] = await pool.query(
            'DELETE FROM employees WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    // Get total count
    async count() {
        const [rows] = await pool.query(
            'SELECT COUNT(*) as total FROM employees WHERE status = "active"'
        );
        return rows[0].total;
    },

    // Update status only
    async updateStatus(id, status) {
        const [result] = await pool.query(
            'UPDATE employees SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Employee;
