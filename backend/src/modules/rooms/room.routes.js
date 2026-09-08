const express = require('express');
const router = express.Router();
const roomsController = require('./rooms.controller');
const { validateCreateRoom, validateUpdateRoom } = require('./rooms.validation');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const ROLES = require('../../constants/role.constant');

// ============================================
// PUBLIC ROUTES (Cần Login)
// ============================================

// Lấy danh sách phòng theo rạp (có phân trang)
// GET /api/rooms?cinemaId=1&page=1&limit=10
router.get('/', authenticate, roomsController.getAll.bind(roomsController));

// Lấy tất cả phòng theo rạp (không phân trang)
// GET /api/rooms/all?cinemaId=1
router.get('/all', authenticate, roomsController.getAllRooms.bind(roomsController));

// Lấy chi tiết phòng
// GET /api/rooms/:id
router.get('/:id', authenticate, roomsController.getById.bind(roomsController));

// Lấy số lượng phòng
// GET /api/rooms/count?cinemaId=1
router.get('/count', authenticate, roomsController.getCount.bind(roomsController));

// ============================================
// ADMIN ROUTES
// ============================================

// Tạo phòng mới
// POST /api/rooms
router.post(
    '/',
    authenticate,
    authorize(ROLES.ADMIN),
    validateCreateRoom,
    roomsController.create.bind(roomsController)
);

// Cập nhật phòng
// PUT /api/rooms/:id
router.put(
    '/:id',
    authenticate,
    authorize(ROLES.ADMIN),
    validateUpdateRoom,
    roomsController.update.bind(roomsController)
);

// Xóa phòng
// DELETE /api/rooms/:id
router.delete(
    '/:id',
    authenticate,
    authorize(ROLES.ADMIN),
    roomsController.delete.bind(roomsController)
);

module.exports = router;