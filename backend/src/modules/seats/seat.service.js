const seatsRepository = require('./seats.repository');
const { NotFoundError } = require('../../utils/error');

class SeatsService {

    // ============================================
    // 1. Lấy danh sách ghế theo phòng (có phân trang)
    // ============================================
    async getSeatsByRoom(roomId, page = 1, limit = 20) {
        return await seatsRepository.findByRoom(roomId, page, limit);
    }

    // ============================================
    // 2. Lấy tất cả ghế theo phòng (không phân trang)
    // ============================================
    async getAllSeatsByRoom(roomId) {
        return await seatsRepository.findAllByRoom(roomId);
    }

    // ============================================
    // 3. Lấy chi tiết ghế theo ID
    // ============================================
    async getSeatById(id) {
        const seat = await seatsRepository.findById(id);
        if (!seat) {
            throw new NotFoundError('Không tìm thấy ghế');
        }
        return seat;
    }

    // ============================================
    // 4. Tạo ghế mới
    // ============================================
    async createSeat(seatData) {
        return await seatsRepository.create(seatData);
    }

    // ============================================
    // 5. Cập nhật ghế
    // ============================================
    async updateSeat(id, seatData) {
        const existingSeat = await seatsRepository.findById(id);
        if (!existingSeat) {
            throw new NotFoundError('Không tìm thấy ghế');
        }
        return await seatsRepository.update(id, seatData);
    }

    // ============================================
    // 6. Xóa ghế
    // ============================================
    async deleteSeat(id) {
        await seatsRepository.delete(id);
        return true;
    }

    // ============================================
    // 7. Đếm số ghế theo phòng
    // ============================================
    async countSeatsByRoom(roomId, activeOnly = true) {
        return await seatsRepository.countByRoom(roomId, activeOnly);
    }
}

module.exports = new SeatsService();