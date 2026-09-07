const { z } = require('zod');

const createBookingSchema = z.object({
    body: z.object({
        bookingId: z
            .number()
            .int()
            .positive()
            .optional(),

        showtimeId: z
            .number()
            .int()
            .positive(
                'Showtime ID must be positive'
            ),

        ticketTypeId: z
            .number()
            .int()
            .positive(
                'Ticket type ID must be positive'
            ),

        seatIds: z
            .array(
                z
                    .number()
                    .int()
                    .positive(
                        'Seat ID must be positive'
                    )
            )
            .min(
                1,
                'At least one seat is required'
            ),

        promotionId: z
            .number()
            .int()
            .positive()
            .nullable()
            .optional(),
    }),
});

module.exports = {
    createBookingSchema,
};