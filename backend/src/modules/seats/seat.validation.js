const { z } = require('zod');

// Schema tạo ghế
const seatSchema = z.object({
    MaPhong: z.number()
        .int()
        .positive('Mã phòng phải là số dương'), // phải là số dương
    MaLoaiGhe: z.number()
        .int()
        .positive('Mã loại ghế phải là số dương'),
    SoGhe: z.number()
        .int()
        .min(1, 'Số ghế tối thiểu là 1'),
    HangGhe: z.string()
        .min(1, 'Hàng ghế không được để trống')
        .max(10, 'Hàng ghế không quá 10 ký tự'),
    TrangThaiVatLy: z.string()
        .default('HoatDong')
        .refine(val => ['HoatDong', 'Hong'].includes(val), {
            message: 'Trạng thái vật lý không hợp lệ, chỉ chấp nhận: HoatDong, Hong'
        })
});

// Schema cập nhật (tất cả field là optional)
const seatUpdateSchema = seatSchema.partial();

// Validate tạo ghế
function validateCreateSeat(req, res, next) {
    try {
        seatSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.errors[0].message
        });
    }
}

// Validate cập nhật ghế
function validateUpdateSeat(req, res, next) {
    try {
        seatUpdateSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.errors[0].message
        });
    }
}

module.exports = {
    validateCreateSeat,
    validateUpdateSeat,
    seatSchema,
    seatUpdateSchema
};