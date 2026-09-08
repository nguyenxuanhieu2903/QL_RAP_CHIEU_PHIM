const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { validateCreatePayment } = require('./payment.validation');

router.get('/', paymentController.getAllPayments);
router.post('/', validateCreatePayment, paymentController.createPayment);
router.get('/booking/:bookingId', paymentController.getPaymentByBookingId);
router.get('/:id', paymentController.getPaymentById);

module.exports = router;