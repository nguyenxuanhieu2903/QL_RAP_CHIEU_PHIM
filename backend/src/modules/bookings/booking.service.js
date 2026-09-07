const AppError = require('../../utils/error');

const bookingRepository =
    require('./booking.repository');


// ========================================
// ĐẶT VÉ
// ========================================
const createBooking = async ({
    bookingId,
    customerId,
    showtimeId,
    ticketTypeId,
    promotionId,
    employeeId,
    seatIds,
}) => {

    if (!Array.isArray(seatIds) || seatIds.length === 0) {
        throw new AppError(
            'At least one seat is required',
            400
        );
    }

    return await bookingRepository.createBooking({
        bookingId,
        customerId,
        showtimeId,
        ticketTypeId,
        promotionId,
        employeeId,
        seatIds,
    });
};


// ========================================
// HỦY VÉ
// ========================================
const cancelBooking = async (
    bookingId
) => {

    const result =
        await bookingRepository.cancelBooking(
            bookingId
        );

    if (!result || result.length === 0) {
        throw new AppError(
            'Booking not found',
            404
        );
    }

    return result;
};


// ========================================
// LẤY LỊCH SỬ ĐẶT VÉ
// ========================================
const getMyBookings = async (
    customerId
) => {

    return await
        bookingRepository.getMyBookings(
            customerId
        );
};


// ========================================
// LẤY CHI TIẾT BOOKING
// Customer chỉ xem booking của mình
// ========================================
const getBookingById = async (
    bookingId,
    customerId
) => {

    const result =
        await bookingRepository.getBookingById(
            bookingId,
            customerId
        );

    if (!result || result.length === 0) {
        throw new AppError(
            'Booking not found or access denied',
            404
        );
    }

    return result;
};


// ========================================
// LẤY TẤT CẢ BOOKING
// ========================================
const getAllBookings = async (
    filters
) => {

    return await
        bookingRepository.getAllBookings(
            filters
        );
};


module.exports = {
    createBooking,
    cancelBooking,
    getMyBookings,
    getBookingById,
    getAllBookings,
};