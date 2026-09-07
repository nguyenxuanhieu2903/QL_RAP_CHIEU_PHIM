const express = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const bookingRoutes = require('../modules/bookings/booking.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);

module.exports = router;