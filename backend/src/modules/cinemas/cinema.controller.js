const cinemasService = require('./cinemas.service');
const { successResponse, errorResponse, paginatedResponse } = require('../../utils/response');
const { AppError } = require('../../utils/error');

class CinemasController {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const keyword = req.query.keyword || '';

            const result = await cinemasService.getCinemas(page, limit, keyword);
            return paginatedResponse(
                res,
                result.items,
                result.total,
                page,
                limit,
                'Lấy danh sách rạp thành công'
            );
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const cinema = await cinemasService.getCinemaById(id);
            return successResponse(res, 'Lấy thông tin rạp thành công', cinema);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const cinema = await cinemasService.createCinema(req.body);
            return successResponse(res, 'Tạo rạp thành công', cinema, 201);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const cinema = await cinemasService.updateCinema(id, req.body);
            return successResponse(res, 'Cập nhật rạp thành công', cinema);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await cinemasService.deleteCinema(id);
            return successResponse(res, 'Xóa rạp thành công');
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getStats(req, res) {
        try {
            const total = await cinemasService.countCinemas(true);
            return successResponse(res, 'Thống kê rạp thành công', { total });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    handleError(res, error) {
        if (error instanceof AppError) {
            return errorResponse(res, error.message, error.statusCode);
        }
        console.error('Error:', error);
        return errorResponse(res, 'Internal server error', 500);
    }
}

module.exports = new CinemasController();