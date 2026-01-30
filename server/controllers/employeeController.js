const Employee = require('../models/employeeModel');

const employeeController = {
    // GET /employees - Get all employees
    async getAll(req, res) {
        try {
            const employees = await Employee.findAll();
            res.json({
                success: true,
                data: employees
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch employees',
                error: error.message
            });
        }
    },

    // GET /employees/:id - Get employee by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const employee = await Employee.findById(id);
            
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            res.json({
                success: true,
                data: employee
            });
        } catch (error) {
            console.error('Error fetching employee:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch employee',
                error: error.message
            });
        }
    },

    // POST /employees - Create new employee
    async create(req, res) {
        try {
            const { nik, name, position, join_date, status } = req.body;

            // Validation
            if (!nik || !name || !position || !join_date) {
                return res.status(400).json({
                    success: false,
                    message: 'NIK, name, position, and join_date are required'
                });
            }

            // Check if NIK already exists
            const existingEmployee = await Employee.findByNik(nik);
            if (existingEmployee) {
                return res.status(400).json({
                    success: false,
                    message: 'Employee with this NIK already exists'
                });
            }

            const employee = await Employee.create({
                nik,
                name,
                position,
                join_date,
                status: status || 'active'
            });

            res.status(201).json({
                success: true,
                message: 'Employee created successfully',
                data: employee
            });
        } catch (error) {
            console.error('Error creating employee:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create employee',
                error: error.message
            });
        }
    },

    // PUT /employees/:id - Update employee
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nik, name, position, join_date, status } = req.body;

            // Check if employee exists
            const existingEmployee = await Employee.findById(id);
            if (!existingEmployee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            // Check if new NIK conflicts with another employee
            if (nik && nik !== existingEmployee.nik) {
                const nikExists = await Employee.findByNik(nik);
                if (nikExists) {
                    return res.status(400).json({
                        success: false,
                        message: 'Another employee with this NIK already exists'
                    });
                }
            }

            const updated = await Employee.update(id, {
                nik: nik || existingEmployee.nik,
                name: name || existingEmployee.name,
                position: position || existingEmployee.position,
                join_date: join_date || existingEmployee.join_date,
                status: status || existingEmployee.status
            });

            if (updated) {
                const employee = await Employee.findById(id);
                res.json({
                    success: true,
                    message: 'Employee updated successfully',
                    data: employee
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Failed to update employee'
                });
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update employee',
                error: error.message
            });
        }
    },

    // DELETE /employees/:id - Delete employee
    async delete(req, res) {
        try {
            const { id } = req.params;

            // Check if employee exists
            const employee = await Employee.findById(id);
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            const deleted = await Employee.delete(id);
            if (deleted) {
                res.json({
                    success: true,
                    message: 'Employee deleted successfully'
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Failed to delete employee'
                });
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete employee',
                error: error.message
            });
        }
    }
};

module.exports = employeeController;
