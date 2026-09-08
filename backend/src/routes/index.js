const express = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const cinemaRoutes = require('../modules/cinemas/cinemas.routes');
const roomRoutes = require('../modules/rooms/rooms.routes');
const seatRoutes = require('../modules/seats/seats.routes');


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cinemas', cinemaRoutes);  // API rạp
router.use('/rooms', roomRoutes);      // API phòng
router.use('/seats', seatRoutes);      // API ghế

module.exports = router;