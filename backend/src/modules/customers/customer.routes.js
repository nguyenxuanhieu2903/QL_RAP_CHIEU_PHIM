const express = require('express');
const router = express.Router();
const customerController = require('./customer.controller');
const { validateCustomerUpdate } = require('./customer.validation');

router.get('/me', customerController.getCustomerMe);
router.put('/me', validateCustomerUpdate, customerController.updateCustomerMe);

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', validateCustomerUpdate, customerController.updateCustomer);

module.exports = router;