const express = require('express');
const router = express.Router();
const employeeController = require('./employee.controller');
const { verifyToken, authorize } = require('../../middleware/auth.middleware');

// Toàn bộ các API quản lý nhân viên yêu cầu đăng nhập và có quyền ADMIN[cite: 1]
router.get('/', verifyToken, authorize(['ADMIN']), employeeController.getAllEmployees);
router.get('/:id', verifyToken, authorize(['ADMIN']), employeeController.getEmployeeById);
router.post('/', verifyToken, authorize(['ADMIN']), employeeController.createEmployee);
router.put('/:id', verifyToken, authorize(['ADMIN']), employeeController.updateEmployee);
router.delete('/:id', verifyToken, authorize(['ADMIN']), employeeController.deleteEmployee);

module.exports = router;