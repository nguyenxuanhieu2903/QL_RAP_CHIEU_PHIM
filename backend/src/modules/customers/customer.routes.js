const express = require('express');
const router = express.Router();
const customerController = require('./customer.controller');
const { verifyToken, authorize } = require('../../middleware/auth.middleware');

// Routes cho cá nhân khách hàng
router.get('/me', verifyToken, authorize(['CUSTOMER']), customerController.getMe);
router.put('/me', verifyToken, authorize(['CUSTOMER']), customerController.updateMe);

// Routes cho Staff và Admin quản lý khách hàng
router.get('/', verifyToken, authorize(['STAFF', 'ADMIN']), customerController.getAllCustomers);
router.get('/:id', verifyToken, authorize(['STAFF', 'ADMIN']), customerController.getCustomerById);
router.put('/:id', verifyToken, authorize(['STAFF', 'ADMIN']), customerController.updateCustomer);

module.exports = router;