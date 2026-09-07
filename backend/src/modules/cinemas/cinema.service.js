const cinemasRepository = require('./cinemas.repository');
const { NotFoundError, ConflictError } = require('../../utils/error');

class CinemasService {
    async getCinemas(page = 1, limit = 10, keyword = '') {
        const result = await cinemasRepository.findAll(page, limit, keyword);
        return result;
    }

    async getCinemaById(id) {
        const cinema = await cinemasRepository.findById(id);
        if (!cinema) {
            throw new NotFoundError('Không tìm thấy rạp');
        }
        return cinema;
    }

    async createCinema(cinemaData) {
        // Kiểm tra tên rạp đã tồn tại
        const exists = await cinemasRepository.existsByName(cinemaData.tenRap);
        if (exists) {
            throw new ConflictError('Tên rạp đã tồn tại');
        }

        const cinema = await cinemasRepository.create(cinemaData);
        return cinema;
    }

    async updateCinema(id, cinemaData) {
        // Kiểm tra rạp tồn tại
        const existingCinema = await cinemasRepository.findById(id);
        if (!existingCinema) {
            throw new NotFoundError('Không tìm thấy rạp');
        }

        // Kiểm tra tên rạp trùng
        if (cinemaData.tenRap) {
            const exists = await cinemasRepository.existsByName(cinemaData.tenRap, id);
            if (exists) {
                throw new ConflictError('Tên rạp đã tồn tại');
            }
        }

        const cinema = await cinemasRepository.update(id, cinemaData);
        return cinema;
    }

    async deleteCinema(id) {
        await cinemasRepository.delete(id);
        return true;
    }

    async countCinemas(activeOnly = true) {
        return await cinemasRepository.count(activeOnly);
    }
}

module.exports = new CinemasService();