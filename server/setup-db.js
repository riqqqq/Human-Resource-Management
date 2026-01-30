const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const setupDatabase = async () => {
    console.log('🔧 Setting up database with RBAC...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT || 3306
    });

    const dbName = process.env.DB_NAME || 'hrm_db';

    try {
        // Create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`✅ Database "${dbName}" created/verified`);
        await connection.query(`USE ${dbName}`);

        // Create employees table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nik VARCHAR(20) NOT NULL UNIQUE,
                name VARCHAR(100) NOT NULL,
                position VARCHAR(50) NOT NULL,
                join_date DATE NOT NULL,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_nik (nik),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table "employees" created/verified');

        // Create attendance table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT NOT NULL,
                date DATE NOT NULL,
                time_in TIME NOT NULL,
                time_out TIME DEFAULT NULL,
                image_path VARCHAR(255) DEFAULT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
                INDEX idx_employee_date (employee_id, date),
                INDEX idx_date (date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table "attendance" created/verified');

        // Ensure columns exist (Migration logic for existing tables)
        try {
            await connection.query("ALTER TABLE attendance ADD COLUMN image_path VARCHAR(255) DEFAULT NULL");
            console.log('   -> Added missing column: image_path');
        } catch (err) {
            if (err.code !== 'ER_DUP_FIELDNAME') console.warn('   -> Note: image_path check skipped');
        }

        try {
            await connection.query("ALTER TABLE attendance ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'");
            console.log('   -> Added missing column: status');
        } catch (err) {
            if (err.code !== 'ER_DUP_FIELDNAME') console.warn('   -> Note: status check skipped');
        }

        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'employee') DEFAULT 'employee',
                employee_id INT DEFAULT NULL,
                is_active BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
                INDEX idx_username (username),
                INDEX idx_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ Table "users" created/verified');

        // Check if admin user exists
        const [admins] = await connection.query(
            "SELECT * FROM users WHERE username = 'admin'"
        );

        if (admins.length === 0) {
            // Create default admin user (password: admin123)
            const adminPasswordHash = await bcrypt.hash('admin123', 10);
            await connection.query(
                `INSERT INTO users (username, password_hash, role, is_active) 
                 VALUES ('admin', ?, 'admin', TRUE)`,
                [adminPasswordHash]
            );
            console.log('✅ Default admin user created (admin / admin123)');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        console.log('\n🎉 Database setup complete!');
        console.log('   You can now run: npm run dev\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
};

setupDatabase();
