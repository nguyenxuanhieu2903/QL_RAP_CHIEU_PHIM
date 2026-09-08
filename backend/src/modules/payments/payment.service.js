const paymentRepository = require('./payment.repository');

const getAllPayments = async () => {
    return await paymentRepository.findAll();
};

const createPayment = async (data) => {
    // Có thể thêm validate logic nghiệp vụ ở đây trước khi gọi repository
    return await paymentRepository.create(data);
};

module.exports = {
    getAllPayments,
    createPayment
};