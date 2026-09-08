const express = require('express');
const router = express.Router();
const seatsController = require('./seats.controller');
const { validateCreateSeat, validateUpdateSeat } = require('./seats.validation');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const ROLES = require('../../constants/role.constant');


// PUBLIC ROUTES
// Lấy danh sách ghế theo phòng (có phân trang)
router.get('/room/:roomId', seatsController.getByRoom.bind(seatsController));

// Lấy tất cả ghế theo phòng (không phân trang)
router.get('/room/:roomId/all', seatsController.getAllByRoom.bind(seatsController));

// Lấy số lượng ghế theo phòng
router.get('/room/:roomId/count', seatsController.getCount.bind(seatsController));

// Lấy chi tiết ghế
router.get('/:id', seatsController.getById.bind(seatsController));

// ADMIN ROUTES (Chỉ ADMIN mới được tạo/sửa/xóa)
// Tạo ghế mới
// POST /api/seats
router.post(
    '/',
    authenticate,
    authorize(ROLES.ADMIN),
    validateCreateSeat,
    seatsController.create.bind(seatsController)
);

// Cập nhật ghế
// PUT /api/seats/:id
router.put(
    '/:id',
    authenticate,
    authorize(ROLES.ADMIN),
    validateUpdateSeat,
    seatsController.update.bind(seatsController)
);

// Xóa ghế
// DELETE /api/seats/:id
router.delete(
    '/:id',
    authenticate,
    authorize(ROLES.ADMIN),
    seatsController.delete.bind(seatsController)
);

module.exports = router;