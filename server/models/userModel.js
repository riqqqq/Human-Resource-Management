const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    // Find user by username
    async findByUsername(username) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    },

    // Find user by ID
    async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, username, role, employee_id, is_active, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Create new user
    async create(data) {
        const { username, password, role = 'employee', employee_id = null, is_active = false } = data;
        const password_hash = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO users (username, password_hash, role, employee_id, is_active) VALUES (?, ?, ?, ?, ?)',
            [username, password_hash, role, employee_id, is_active]
        );
        return { id: result.insertId, username, role, employee_id, is_active };
    },

    // Verify password
    async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    },

    // Update user status (admin approve/reject)
    async updateStatus(id, is_active) {
        const [result] = await pool.query(
            'UPDATE users SET is_active = ? WHERE id = ?',
            [is_active, id]
        );
        return result.affectedRows > 0;
    },

    // Get all users (for admin)
    async findAll() {
        const [rows] = await pool.query(
            `SELECT u.id, u.username, u.role, u.employee_id, u.is_active, u.created_at,
                    e.name as employee_name, e.nik
             FROM users u
             LEFT JOIN employees e ON u.employee_id = e.id
             ORDER BY u.created_at DESC`
        );
        return rows;
    },

    // Get pending users (not active)
    async findPending() {
        const [rows] = await pool.query(
            `SELECT u.id, u.username, u.role, u.employee_id, u.created_at,
                    e.name as employee_name, e.nik
             FROM users u
             LEFT JOIN employees e ON u.employee_id = e.id
             WHERE u.is_active = FALSE
             ORDER BY u.created_at DESC`
        );
        return rows;
    },

    // Delete user
    async delete(id) {
        const [result] = await pool.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = User;
