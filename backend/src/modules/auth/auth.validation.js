const { z } = require('zod');

const registerSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters'),

        password: z
            .string()
            .min(6, 'Password must be at least 6 characters'),

        email: z
            .string()
            .email('Invalid email'),

        fullName: z
            .string()
            .min(1, 'Full name is required'),

        phone: z
            .string()
            .min(10, 'Phone number must be at least 10 characters'),
    }),
});

const loginSchema = z.object({
    body: z.object({
        username: z
            .string()
            .min(1, 'Username is required'),

        password: z
            .string()
            .min(1, 'Password is required'),
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
};