const { z } = require('zod');

const validateCreatePayment = (req, res, next) => {
    const schema = z.object({
        maDatVe: z.number().int().positive({ message: "MaDatVe must be a positive integer" }),
        amount: z.number().positive({ message: "Amount must be a positive number" }),
        method: z.string().trim().min(1, { message: "Method cannot be empty" }),
        trangThaiThanhToan: z.string().optional().default("Thanh cong")
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: result.error.errors[0].message
        });
    }
    req.body = result.data;
    next();
};

module.exports = {
    validateCreatePayment
};