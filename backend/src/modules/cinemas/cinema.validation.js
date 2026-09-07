const { z } = require('zod');

// Schema validation using Zod
const cinemaSchema = z.object({
    tenRap: z.string()
        .min(2, 'Tên rạp phải có ít nhất 2 ký tự')
        .max(100, 'Tên rạp không quá 100 ký tự'),
    diaChi: z.string()
        .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
        .max(200, 'Địa chỉ không quá 200 ký tự'),
    sdt: z.string()
        .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
    email: z.string()
        .email('Email không hợp lệ')
        .optional(),
    trangThai: z.boolean().default(true)
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