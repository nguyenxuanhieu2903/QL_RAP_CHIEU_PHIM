const movieService = require('./movie.service');

class MovieController {
    async getMovies(req, res, next) {
        try {
            const movies = await movieService.getAllMovies(req.query);
            return res.status(200).json({
                success: true,
                message: 'Lấy danh sách phim thành công',
                data: movies
            });
        } catch (error) {
            next(error);
        }
    }

    async getMovieById(req, res, next) {
        try {
            const movie = await movieService.getMovieById(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'Lấy thông tin phim thành công',
                data: movie
            });
        } catch (error) {
            next(error);
        }
    }

    async createMovie(req, res, next) {
        try {
            const newMovie = await movieService.createMovie(req.body);
            return res.status(201).json({
                success: true,
                message: 'Thêm phim mới thành công',
                data: newMovie
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMovie(req, res, next) {
        try {
            const updatedMovie = await movieService.updateMovie(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                message: 'Cập nhật thông tin phim thành công',
                data: updatedMovie
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteMovie(req, res, next) {
        try {
            await movieService.deleteMovie(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'Xóa phim thành công'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MovieController();