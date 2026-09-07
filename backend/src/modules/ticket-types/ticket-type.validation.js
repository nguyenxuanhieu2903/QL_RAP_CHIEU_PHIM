const { z } = require('zod');

const createTicketTypeSchema = z.object({
    body: z.object({
        tenLoaiVe: z
            .string()
            .min(1, 'Ticket type name is required')
            .max(100, 'Ticket type name must not exceed 100 characters'),

        moTaLoaiVe: z
            .string()
            .max(255, 'Description must not exceed 255 characters')
            .optional()
            .nullable(),
    }),
});

const updateTicketTypeSchema = z.object({
    body: z.object({
        tenLoaiVe: z
            .string()
            .min(1, 'Ticket type name is required')
            .max(100, 'Ticket type name must not exceed 100 characters'),

        moTaLoaiVe: z
            .string()
            .max(255, 'Description must not exceed 255 characters')
            .optional()
            .nullable(),
    }),
});

module.exports = {
    createTicketTypeSchema,
    updateTicketTypeSchema,
};