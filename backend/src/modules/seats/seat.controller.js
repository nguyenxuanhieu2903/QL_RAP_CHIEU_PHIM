const seatsService = require('./seats.service');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/response');
const { AppError } = require('../../utils/error');

class SeatsController {

    // ============================================
    // 1. GET /api/seats/room/:roomId?page=1&limit=20
    // ============================================
    async getByRoom(req, res) {
        try {
            const roomId = parseInt(req.params.roomId);
            if (!roomId) {
                return errorResponse(res, 'Vui lòng cung cấp roomId', 400);
            }

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const result = await seatsService.getSeatsByRoom(roomId, page, limit);
            return paginatedResponse(
                res,
                result.items,
                result.total,
                page,
                limit,
                'Lấy danh sách ghế thành công'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 2. GET /api/seats/room/:roomId/all
    // ============================================
    async getAllByRoom(req, res) {
        try {
            const roomId = parseInt(req.params.roomId);
            if (!roomId) {
                return errorResponse(res, 'Vui lòng cung cấp roomId', 400);
            }

            const seats = await seatsService.getAllSeatsByRoom(roomId);
            return successResponse(res, 'Lấy danh sách ghế thành công', seats);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 3. GET /api/seats/:id
    // ============================================
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const seat = await seatsService.getSeatById(id);
            return successResponse(res, 'Lấy thông tin ghế thành công', seat);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 4. POST /api/seats
    // ============================================
    async create(req, res) {
        try {
            const seat = await seatsService.createSeat(req.body);
            return successResponse(res, 'Tạo ghế thành công', seat, 201);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 5. PUT /api/seats/:id
    // ============================================
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const seat = await seatsService.updateSeat(id, req.body);
            return successResponse(res, 'Cập nhật ghế thành công', seat);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 6. DELETE /api/seats/:id
    // ============================================
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await seatsService.deleteSeat(id);
            return successResponse(res, 'Xóa ghế thành công');
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // ============================================
    // 7. GET /api/seats/room/:roomId/count
    // ============================================
    async getCount(req, res) {
        try {
            const roomId = parseInt(req.params.roomId);
            if (!roomId) {
                return errorResponse(res, 'Vui lòng cung cấp roomId', 400);
            }

            const activeOnly = req.query.activeOnly !== 'false';
            const total = await seatsService.countSeatsByRoom(roomId, activeOnly);
            return successResponse(res, 'Thống kê ghế thành công', { total });
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

module.exports = new SeatsController();