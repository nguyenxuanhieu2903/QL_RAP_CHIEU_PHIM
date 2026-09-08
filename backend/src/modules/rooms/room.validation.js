const { z } = require('zod');

const roomSchema = z.object({
    MaRap: z.number()
        .int()
        .positive('Mã rạp phải là số dương'),
    TenPhong: z.string()
        .min(1, 'Tên phòng không được để trống')
        .max(100, 'Tên phòng không quá 100 ký tự'),
    TongSoGhe: z.number()
        .int()
        .min(1, 'Số lượng ghế tối thiểu là 1')
        .max(500, 'Số lượng ghế tối đa là 500')
});

const roomUpdateSchema = roomSchema.partial();

function validateCreateRoom(req, res, next) {
    try {
        roomSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.errors[0].message
        });
    }
}

function validateUpdateRoom(req, res, next) {
    try {
        roomUpdateSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.errors[0].message
        });
    }
}

module.exports = {
    validateCreateRoom,
    validateUpdateRoom,
    roomSchema
};