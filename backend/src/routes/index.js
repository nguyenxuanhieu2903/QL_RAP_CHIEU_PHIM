const express = require('express');
const router = express.Router();

const customerRoutes = require('../modules/customers/customer.routes');
const paymentRoutes = require('../modules/payments/payment.routes');
const employeeRoutes = require('../modules/employees/employee.routes');
const authRoutes = require('../modules/auth/auth.routes');

router.use('/customers', customerRoutes);
router.use('/payments', paymentRoutes);
router.use('/employees', employeeRoutes);
router.use('/auth', authRoutes);

module.exports = router;