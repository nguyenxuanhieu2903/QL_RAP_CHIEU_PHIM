const express = require('express');
const router = express.Router();
const movieRoutes = require('../modules/movies/movie.routes');

router.use('/movies', movieRoutes);

module.exports = router;