const employeeRepository = require('./employee.repository');

const getAllEmployees = async () => {
    return await employeeRepository.getAll();
};

const getEmployeeById = async (id) => {
    const employee = await employeeRepository.getById(id);
    if (!employee) {
        throw new Error('Không tìm thấy nhân viên');
    }
    return employee;
};

const createEmployee = async (data) => {
    return await employeeRepository.create(data);
};

const updateEmployee = async (id, updateData) => {
    const existing = await employeeRepository.getById(id);
    if (!existing) {
        throw new Error('Không tìm thấy nhân viên');
    }
    return await employeeRepository.update(id, updateData);
};

const deleteEmployee = async (id) => {
    const existing = await employeeRepository.getById(id);
    if (!existing) {
        throw new Error('Không tìm thấy nhân viên');
    }
    return await employeeRepository.remove(id);
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};