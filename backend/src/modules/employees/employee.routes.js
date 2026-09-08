const express = require('express');
const router = express.Router();
const employeeController = require('./employee.controller');
const { validateEmployeeCreate, validateEmployeeUpdate } = require('./employee.validation');

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', validateEmployeeCreate, employeeController.createEmployee);
router.put('/:id', validateEmployeeUpdate, employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;