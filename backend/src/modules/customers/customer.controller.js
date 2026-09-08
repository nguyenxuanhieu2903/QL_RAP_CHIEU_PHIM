const customerRepository = require('./customer.repository');

const getAllCustomers = async (req, res) => {
    try {
        const customers = await customerRepository.findAll();
        return res.status(200).json({ success: true, data: customers });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customer = await customerRepository.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        return res.status(200).json({ success: true, data: customer });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCustomerMe = async (req, res) => {
    try {
        const customerId = req.user?.id || 1; 
        const customer = await customerRepository.findById(customerId);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        return res.status(200).json({ success: true, data: customer });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const updated = await customerRepository.update(req.params.id, req.body);
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateCustomerMe = async (req, res) => {
    try {
        const customerId = req.user?.id || 1;
        const updated = await customerRepository.update(customerId, req.body);
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    getCustomerMe,
    updateCustomer,
    updateCustomerMe
};