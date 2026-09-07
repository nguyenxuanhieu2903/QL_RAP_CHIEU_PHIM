const customerService = require('./customer.service');

// Lấy thông tin cá nhân của khách hàng đang đăng nhập
const getMe = async (req, res) => {
    try {
        const customerId = req.user.id;
        const customer = await customerService.getCustomerById(customerId);
        res.status(200).json({ success: true, message: 'Success', data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật thông tin cá nhân của khách hàng đang đăng nhập
const updateMe = async (req, res) => {
    try {
        const customerId = req.user.id;
        const updated = await customerService.updateCustomer(customerId, req.body);
        res.status(200).json({ success: true, message: 'Success', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách toàn bộ khách hàng (Dành cho Staff/Admin)
const getAllCustomers = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.status(200).json({ success: true, message: 'Success', data: customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xem chi tiết một khách hàng theo ID (Dành cho Staff/Admin)
const getCustomerById = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        res.status(200).json({ success: true, message: 'Success', data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật thông tin khách hàng theo ID (Dành cho Staff/Admin)
const updateCustomer = async (req, res) => {
    try {
        const updated = await customerService.updateCustomer(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Success', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getMe,
    updateMe,
    getAllCustomers,
    getCustomerById,
    updateCustomer
};