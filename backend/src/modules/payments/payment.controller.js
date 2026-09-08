const paymentRepository = require('./payment.repository');

const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentRepository.findAll();
        return res.status(200).json({ success: true, data: payments });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const createPayment = async (req, res) => {
    try {
        const newPayment = await paymentRepository.create(req.body);
        return res.status(201).json({ success: true, data: newPayment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getPaymentById = async (req, res) => {
    try {
        const payment = await paymentRepository.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }
        return res.status(200).json({ success: true, data: payment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getPaymentByBookingId = async (req, res) => {
    try {
        const payment = await paymentRepository.findByBookingId(req.params.bookingId);
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment for this booking not found" });
        }
        return res.status(200).json({ success: true, data: payment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllPayments,
    createPayment,
    getPaymentById,
    getPaymentByBookingId
};