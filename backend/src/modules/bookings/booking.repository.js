const { getPool, sql } = require('../../config/database');


// ========================================
// ĐẶT VÉ
// Gọi Stored Procedure: SP_T01_DatVe
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
    const pool = getPool();

    const seatList = seatIds.join(',');

    const result = await pool
        .request()
        .input(
            'MaDatVe',
            sql.Int,
            bookingId
        )
        .input(
            'MaKhachHang',
            sql.Int,
            customerId
        )
        .input(
            'MaSuatChieu',
            sql.Int,
            showtimeId
        )
        .input(
            'MaLoaiVe',
            sql.Int,
            ticketTypeId
        )
        .input(
            'MaKhuyenMai',
            sql.Int,
            promotionId || null
        )
        .input(
            'MaNhanVien',
            sql.Int,
            employeeId || null
        )
        .input(
            'DanhSachMaGhe',
            sql.VarChar(500),
            seatList
        )
        .execute('SP_T01_DatVe');

    return result.recordset;
};


// ========================================
// HỦY VÉ
// Gọi Stored Procedure: SP_T03_HuyVe
// ========================================
const cancelBooking = async (bookingId) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input(
            'MaDatVe',
            sql.Int,
            bookingId
        )
        .execute('SP_T03_HuyVe');

    return result.recordset;
};


// ========================================
// LẤY LỊCH SỬ ĐẶT VÉ CỦA KHÁCH HÀNG
// GET /api/bookings/my
// ========================================
const getMyBookings = async (customerId) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input(
            'MaKhachHang',
            sql.Int,
            customerId
        )
        .query(`
            SELECT
                DV.MaDatVe,
                DV.MaKhachHang,
                DV.MaKhuyenMai,
                DV.ThoiGianDat,
                DV.TongTien,
                DV.TrangThai
            FROM DAT_VE DV
            WHERE DV.MaKhachHang = @MaKhachHang
            ORDER BY DV.ThoiGianDat DESC
        `);

    return result.recordset;
};


// ========================================
// LẤY CHI TIẾT BOOKING
// GET /api/bookings/:id
// ========================================
const getBookingById = async (
    bookingId,
    customerId
) => {
    const pool = getPool();

    const result = await pool
        .request()
        .input(
            'MaDatVe',
            sql.Int,
            bookingId
        )
        .input(
            'MaKhachHang',
            sql.Int,
            customerId
        )
        .query(`
            SELECT
                DV.MaDatVe,
                DV.MaKhachHang,
                DV.MaKhuyenMai,
                DV.MaNhanVien,
                DV.ThoiGianDat,
                DV.TongTien,
                DV.TrangThai,

                CT.MaChiTiet,
                CT.MaSuatChieu,
                CT.MaGhe,
                CT.MaLoaiVe,
                CT.GiaTaiThoiDiemDat,

                SC.NgayChieu,
                SC.GioBatDau,
                SC.GioKetThuc,

                PC.MaPhong,
                PC.TenPhong,

                R.MaRap,
                R.TenRap,
                R.DiaChi

            FROM DAT_VE DV

            LEFT JOIN CHI_TIET_DAT_VE CT
                ON CT.MaDatVe = DV.MaDatVe

            LEFT JOIN SUAT_CHIEU SC
                ON SC.MaSuatChieu = CT.MaSuatChieu

            LEFT JOIN PHONG_CHIEU PC
                ON PC.MaPhong = SC.MaPhong

            LEFT JOIN RAP R
                ON R.MaRap = PC.MaRap

            WHERE DV.MaDatVe = @MaDatVe
              AND DV.MaKhachHang = @MaKhachHang
        `);

    return result.recordset;
};


// ========================================
// LẤY DANH SÁCH TẤT CẢ BOOKING
// GET /api/bookings
// Filter:
// status, date, cinemaId, page, limit
// ========================================
const getAllBookings = async ({
    status,
    date,
    cinemaId,
    page = 1,
    limit = 10,
}) => {
    const pool = getPool();

    const offset =
        (page - 1) * limit;

    const request = pool
        .request()
        .input(
            'Status',
            sql.NVarChar(50),
            status || null
        )
        .input(
            'Date',
            sql.Date,
            date || null
        )
        .input(
            'CinemaId',
            sql.Int,
            cinemaId || null
        )
        .input(
            'Offset',
            sql.Int,
            offset
        )
        .input(
            'Limit',
            sql.Int,
            limit
        );

    const result = await request.query(`
        SELECT DISTINCT
            DV.MaDatVe,
            DV.MaKhachHang,
            DV.ThoiGianDat,
            DV.TongTien,
            DV.TrangThai,

            R.MaRap,
            R.TenRap

        FROM DAT_VE DV

        LEFT JOIN CHI_TIET_DAT_VE CT
            ON CT.MaDatVe = DV.MaDatVe

        LEFT JOIN SUAT_CHIEU SC
            ON SC.MaSuatChieu = CT.MaSuatChieu

        LEFT JOIN PHONG_CHIEU PC
            ON PC.MaPhong = SC.MaPhong

        LEFT JOIN RAP R
            ON R.MaRap = PC.MaRap

        WHERE
            (
                @Status IS NULL
                OR DV.TrangThai = @Status
            )

            AND
            (
                @Date IS NULL
                OR SC.NgayChieu = @Date
            )

            AND
            (
                @CinemaId IS NULL
                OR R.MaRap = @CinemaId
            )

        ORDER BY
            DV.ThoiGianDat DESC

        OFFSET @Offset ROWS
        FETCH NEXT @Limit ROWS ONLY
    `);

    return result.recordset;
};


module.exports = {
    createBooking,
    cancelBooking,
    getMyBookings,
    getBookingById,
    getAllBookings,
};