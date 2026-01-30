const User = require('../models/userModel');
const Employee = require('../models/employeeModel');

const authController = {
    // POST /register - Employee self-registration
    async register(req, res) {
        try {
            const { username, password, name, nik, position } = req.body;
            
            console.log('📝 Registration attempt:', { username, name, nik, position });

            // Validation
            if (!username || !password || !name || !nik || !position) {
                console.log('❌ Validation failed - missing fields');
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required: username, password, name, nik, position'
                });
            }

            // Check if username already exists
            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                console.log('❌ Username already exists:', username);
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists'
                });
            }

            // Check if NIK already exists
            const existingEmployee = await Employee.findByNik(nik);
            if (existingEmployee) {
                console.log('❌ NIK already exists:', nik);
                return res.status(400).json({
                    success: false,
                    message: 'Employee with this NIK already exists'
                });
            }

            // Create employee record first (status: inactive)
            console.log('👤 Creating employee record...');
            const employee = await Employee.create({
                nik,
                name,
                position,
                join_date: new Date().toISOString().split('T')[0],
                status: 'inactive' // Pending approval
            });
            console.log('✅ Employee created:', employee);

            // Create user with employee link
            console.log('🔐 Creating user account...');
            const user = await User.create({
                username,
                password,
                role: 'employee',
                employee_id: employee.id,
                is_active: false // Pending approval
            });
            console.log('✅ User created:', { id: user.id, username: user.username, employee_id: user.employee_id });

            res.status(201).json({
                success: true,
                message: 'Registration successful. Please wait for admin approval.',
                data: {
                    user_id: user.id,
                    username: user.username,
                    employee_id: employee.id
                }
            });
        } catch (error) {
            console.error('❌ Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Registration failed',
                error: error.message
            });
        }
    },

    // GET /users - Get all users (admin only)
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users',
                error: error.message
            });
        }
    },

    // GET /users/pending - Get pending users (admin only)
    async getPendingUsers(req, res) {
        try {
            const users = await User.findPending();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch pending users',
                error: error.message
            });
        }
    },

    // PUT /users/:id/approve - Approve user (admin only)
    async approveUser(req, res) {
        try {
            const { id } = req.params;
            
            // Update user status
            const updated = await User.updateStatus(id, true);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Also activate the employee
            const user = await User.findById(id);
            if (user && user.employee_id) {
                await Employee.updateStatus(user.employee_id, 'active');
            }

            res.json({
                success: true,
                message: 'User approved successfully'
            });
        } catch (error) {
            console.error('Error approving user:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to approve user',
                error: error.message
            });
        }
    },

    // PUT /users/:id/reject - Reject user (admin only)
    async rejectUser(req, res) {
        try {
            const { id } = req.params;
            const updated = await User.updateStatus(id, false);
            
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User rejected'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to reject user',
                error: error.message
            });
        }
    },

    // DELETE /users/:id - Delete user (admin only)
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            
            // 1. Find user to get employee_id
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // 2. Delete user account
            await User.delete(id);

            // 3. If linked to employee, delete employee (and cascade attendance)
            if (user.employee_id) {
                await Employee.delete(user.employee_id);
            }

            res.json({
                success: true,
                message: 'User and linked employee data deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete user',
                error: error.message
            });
        }
    }
};

module.exports = authController;
