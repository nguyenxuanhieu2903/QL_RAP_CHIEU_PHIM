const employeeService = require('./employee.service');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.status(200).json({ success: true, message: 'Success', data: employees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);
        res.status(200).json({ success: true, message: 'Success', data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createEmployee = async (req, res) => {
    try {
        const newEmployee = await employeeService.createEmployee(req.body);
        res.status(201).json({ success: true, message: 'Success', data: newEmployee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const updated = await employeeService.updateEmployee(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Success', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        await employeeService.deleteEmployee(req.params.id);
        res.status(200).json({ success: true, message: 'Success', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};