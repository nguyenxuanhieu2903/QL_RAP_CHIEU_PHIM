const { z } = require('zod');

const createPromotionSchema = z.object({
    body: z.object({
        tenKhuyenMai: z
            .string()
            .min(1, 'Promotion name is required')
            .max(150, 'Promotion name must not exceed 150 characters'),

        phanTramGiam: z
            .number()
            .min(0, 'Discount percentage must be at least 0')
            .max(100, 'Discount percentage must not exceed 100'),

        ngayBatDau: z
            .string()
            .min(1, 'Start date is required'),

        ngayKetThuc: z
            .string()
            .min(1, 'End date is required'),
    }),
});

const updatePromotionSchema = z.object({
    body: z.object({
        tenKhuyenMai: z
            .string()
            .min(1, 'Promotion name is required')
            .max(150, 'Promotion name must not exceed 150 characters'),

        phanTramGiam: z
            .number()
            .min(0, 'Discount percentage must be at least 0')
            .max(100, 'Discount percentage must not exceed 100'),

        ngayBatDau: z
            .string()
            .min(1, 'Start date is required'),

        ngayKetThuc: z
            .string()
            .min(1, 'End date is required'),
    }),
});

module.exports = {
    createPromotionSchema,
    updatePromotionSchema,
};