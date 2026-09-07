const express = require('express');

const bookingController =
    require('./booking.controller');

const {
    createBookingSchema,
} = require('./booking.validation');

const {
    authenticate,
} = require('../../middleware/auth.middleware');

const {
    validate,
} = require('../../middleware/validation.middleware');

const router = express.Router();


// ========================================
// ĐẶT VÉ
// POST /api/bookings
// ========================================
router.post(
    '/',
    authenticate,
    validate(createBookingSchema),
    bookingController.createBooking
);


// ========================================
// LẤY LỊCH SỬ ĐẶT VÉ CỦA TÔI
// GET /api/bookings/my
// ========================================
router.get(
    '/my',
    authenticate,
    bookingController.getMyBookings
);


// ========================================
// DANH SÁCH TẤT CẢ BOOKING
// GET /api/bookings
// ========================================
router.get(
    '/',
    authenticate,
    bookingController.getAllBookings
);


// ========================================
// CHI TIẾT BOOKING
// GET /api/bookings/:id
// ========================================
router.get(
    '/:id',
    authenticate,
    bookingController.getBookingById
);


// ========================================
// HỦY VÉ
// POST /api/bookings/:id/cancel
// ========================================
router.post(
    '/:id/cancel',
    authenticate,
    bookingController.cancelBooking
);


module.exports = router;