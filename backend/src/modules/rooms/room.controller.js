const roomsService = require('./rooms.service');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/response');
const { AppError } = require('../../utils/error');

class RoomsController {
    
    // ============================================
    // 1. GET /api/rooms?cinemaId=1&page=1&limit=10
    // ============================================
    async getAll(req, res) {
        try {
            const cinemaId = parseInt(req.query.cinemaId);
            if (!cinemaId) {
                return errorResponse(res, 'Vui lòng cung cấp cinemaId', 400);
            }

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await roomsService.getRoomsByCinema(cinemaId, page, limit);
            return paginatedResponse(
                res,
                result.items,
                result.total,
                page,
                limit,
                'Lấy danh sách phòng thành công'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 2. GET /api/rooms/all?cinemaId=1
    // ============================================
    async getAllRooms(req, res) {
        try {
            const cinemaId = parseInt(req.query.cinemaId);
            if (!cinemaId) {
                return errorResponse(res, 'Vui lòng cung cấp cinemaId', 400);
            }

            const rooms = await roomsService.getAllRoomsByCinema(cinemaId);
            return successResponse(res, 'Lấy danh sách phòng thành công', rooms);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 3. GET /api/rooms/:id
    // ============================================
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const room = await roomsService.getRoomById(id);
            return successResponse(res, 'Lấy thông tin phòng thành công', room);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 4. POST /api/rooms
    // ============================================
    async create(req, res) {
        try {
            const room = await roomsService.createRoom(req.body);
            return successResponse(res, 'Tạo phòng thành công', room, 201);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 5. PUT /api/rooms/:id
    // ============================================
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const room = await roomsService.updateRoom(id, req.body);
            return successResponse(res, 'Cập nhật phòng thành công', room);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 6. DELETE /api/rooms/:id
    // ============================================
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await roomsService.deleteRoom(id);
            return successResponse(res, 'Xóa phòng thành công');
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 7. GET /api/rooms/count?cinemaId=1
    // ============================================
    async getCount(req, res) {
        try {
            const cinemaId = parseInt(req.query.cinemaId);
            if (!cinemaId) {
                return errorResponse(res, 'Vui lòng cung cấp cinemaId', 400);
            }

            const total = await roomsService.countRooms(cinemaId, true);
            return successResponse(res, 'Thống kê phòng thành công', { total });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // Error handler
    // ============================================
    handleError(res, error) {
        if (error instanceof AppError) {
            return errorResponse(res, error.message, error.statusCode);
        }
        console.error('Error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
}

module.exports = new RoomsController();