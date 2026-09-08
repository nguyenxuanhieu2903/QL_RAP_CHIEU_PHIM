const { z } = require('zod');

const cinemaSchema = z.object({
    TenRap: z.string()
        .min(2, 'Tên rạp phải có ít nhất 2 ký tự')
        .max(100, 'Tên rạp không quá 100 ký tự'),
    DiaChi: z.string()
        .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
        .max(255, 'Địa chỉ không quá 255 ký tự'),
    Hotline: z.string()
        .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
});

const cinemaUpdateSchema = cinemaSchema.partial();

function validateCreateCinema(req, res, next) {
    try {
        cinemaSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.errors[0].message
        });
    }
}

function validateUpdateCinema(req, res, next) {
    try {
        cinemaUpdateSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.errors[0].message
        });
    }
}

module.exports = {
    validateCreateCinema,
    validateUpdateCinema,
    cinemaSchema
};