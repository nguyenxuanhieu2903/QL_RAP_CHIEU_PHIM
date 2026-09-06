const movieRepository = require('./movie.repository');

class MovieService {
    async getAllMovies(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const status = query.status || null;
        const keyword = query.keyword || null;

        return await movieRepository.findAll({ page, limit, status, keyword });
    }

    async getMovieById(id) {
        const movie = await movieRepository.findById(id);
        if (!movie) {
            const error = new Error('Phim không tồn tại');
            error.statusCode = 404;
            throw error;
        }
        return movie;
    }

    async createMovie(data) {
        const existingMovie = await movieRepository.findById(data.MaPhim);
        if (existingMovie) {
            const error = new Error('Mã phim đã tồn tại trong hệ thống');
            error.statusCode = 409;
            throw error;
        }
        return await movieRepository.create(data);
    }

    async updateMovie(id, data) {
        await this.getMovieById(id);
        return await movieRepository.update(id, data);
    }

    async deleteMovie(id) {
        await this.getMovieById(id);
        return await movieRepository.delete(id);
    }
}

module.exports = new MovieService();