const customerRepository = require('./customer.repository');

const getAllCustomers = async () => {
    return await customerRepository.getAll();
};

const getCustomerById = async (id) => {
    const customer = await customerRepository.getById(id);
    if (!customer) {
        throw new Error('Không tìm thấy khách hàng');
    }
    return customer;
};

const updateCustomer = async (id, updateData) => {
    // Kiểm tra xem khách hàng có tồn tại không trước khi update
    const existing = await customerRepository.getById(id);
    if (!existing) {
        throw new Error('Không tìm thấy khách hàng');
    }
    return await customerRepository.update(id, updateData);
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    updateCustomer
};