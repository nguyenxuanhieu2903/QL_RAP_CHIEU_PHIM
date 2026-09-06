const express = require('express');
const router = express.Router();
const movieController = require('./movie.controller');

// Public endpoints
router.get('/', (req, res, next) => movieController.getMovies(req, res, next));
router.get('/:id', (req, res, next) => movieController.getMovieById(req, res, next));

// Admin endpoints (CRUD)
router.post('/', (req, res, next) => movieController.createMovie(req, res, next));
router.put('/:id', (req, res, next) => movieController.updateMovie(req, res, next));
router.delete('/:id', (req, res, next) => movieController.deleteMovie(req, res, next));

module.exports = router;