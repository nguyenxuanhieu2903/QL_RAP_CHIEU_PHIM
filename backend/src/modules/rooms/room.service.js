const roomsRepository = require('./rooms.repository');
const { NotFoundError, ConflictError } = require('../../utils/error');

class RoomsService {
    
    // ============================================
    // 1. Lấy danh sách phòng theo rạp
    // ============================================
    async getRoomsByCinema(cinemaId, page = 1, limit = 10) {
        const result = await roomsRepository.findByCinema(cinemaId, page, limit);
        return result;
    }

    // ============================================
    // 2. Lấy danh sách tất cả phòng theo rạp
    // ============================================
    async getAllRoomsByCinema(cinemaId) {
        const rooms = await roomsRepository.findAllByCinema(cinemaId);
        return rooms;
    }

    // ============================================
    // 3. Lấy chi tiết phòng theo ID
    // ============================================
    async getRoomById(id) {
        const room = await roomsRepository.findById(id);
        if (!room) {
            throw new NotFoundError('Không tìm thấy phòng');
        }
        return room;
    }

    // ============================================
    // 4. Tạo phòng mới
    // ============================================
    async createRoom(roomData) {
        // Kiểm tra tên phòng đã tồn tại (repository đã check)
        const room = await roomsRepository.create(roomData);
        return room;
    }

    // ============================================
    // 5. Cập nhật phòng
    // ============================================
    async updateRoom(id, roomData) {
        // Kiểm tra phòng tồn tại
        const existingRoom = await roomsRepository.findById(id);
        if (!existingRoom) {
            throw new NotFoundError('Không tìm thấy phòng');
        }

        // Cập nhật (repository sẽ kiểm tra trùng tên)
        const room = await roomsRepository.update(id, roomData);
        return room;
    }

    // ============================================
    // 6. Xóa phòng
    // ============================================
    async deleteRoom(id) {
        await roomsRepository.delete(id);
        return true;
    }

    // ============================================
    // 7. Đếm số phòng
    // ============================================
    async countRooms(cinemaId, activeOnly = true) {
        return await roomsRepository.countByCinema(cinemaId, activeOnly);
    }
}

module.exports = new RoomsService();