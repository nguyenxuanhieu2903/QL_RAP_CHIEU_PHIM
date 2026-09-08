const employeeRepository = require('./employee.repository');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeRepository.findAll();
        return res.status(200).json({ success: true, data: employees });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeRepository.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        return res.status(200).json({ success: true, data: employee });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const createEmployee = async (req, res) => {
    try {
        const newEmployee = await employeeRepository.create(req.body);
        return res.status(201).json({ success: true, data: newEmployee });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const updated = await employeeRepository.update(req.params.id, req.body);
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        await employeeRepository.remove(req.params.id);
        return res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};