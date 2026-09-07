const bookingService =
    require('./booking.service');

const {
    successResponse,
} = require('../../utils/response');


// ========================================
// ĐẶT VÉ
// POST /api/bookings
// ========================================
const createBooking = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await bookingService.createBooking({
                ...req.validated.body,

                customerId:
                    req.user.customerId,

                employeeId:
                    req.user.employeeId || null,
            });

        return successResponse(
            res,
            result,
            'Booking created successfully',
            201
        );
    } catch (error) {
        next(error);
    }
};


// ========================================
// LỊCH SỬ ĐẶT VÉ CỦA TÔI
// GET /api/bookings/my
// ========================================
const getMyBookings = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await bookingService.getMyBookings(
                req.user.customerId
            );

        return successResponse(
            res,
            result,
            'My bookings retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};


// ========================================
// CHI TIẾT BOOKING
// GET /api/bookings/:id
// ========================================
const getBookingById = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await bookingService.getBookingById(
                Number(req.params.id),
                req.user.customerId
            );

        return successResponse(
            res,
            result,
            'Booking retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};


// ========================================
// HỦY VÉ
// POST /api/bookings/:id/cancel
// ========================================
const cancelBooking = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await bookingService.cancelBooking(
                Number(req.params.id)
            );

        return successResponse(
            res,
            result,
            'Booking cancelled successfully'
        );
    } catch (error) {
        next(error);
    }
};


// ========================================
// DANH SÁCH TẤT CẢ BOOKING
// GET /api/bookings
// ========================================
const getAllBookings = async (
    req,
    res,
    next
) => {
    try {
        const {
            status,
            date,
            cinemaId,
            page,
            limit,
        } = req.query;

        const result =
            await bookingService.getAllBookings({
                status,

                date,

                cinemaId:
                    cinemaId
                        ? Number(cinemaId)
                        : null,

                page:
                    page
                        ? Number(page)
                        : 1,

                limit:
                    limit
                        ? Number(limit)
                        : 10,
            });

        return successResponse(
            res,
            result,
            'Bookings retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
};