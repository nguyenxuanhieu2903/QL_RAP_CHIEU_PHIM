const express = require('express');

const ticketTypeController =
    require('./ticket-type.controller');

const {
    createTicketTypeSchema,
    updateTicketTypeSchema,
} = require('./ticket-type.validation');

const {
    validate,
} = require('../../middleware/validation.middleware');

const router = express.Router();

// GET /api/ticket-types
router.get(
    '/',
    ticketTypeController.getAll
);

// GET /api/ticket-types/:id
router.get(
    '/:id',
    ticketTypeController.getById
);

// POST /api/ticket-types
router.post(
    '/',
    validate(createTicketTypeSchema),
    ticketTypeController.create
);

// PUT /api/ticket-types/:id
router.put(
    '/:id',
    validate(updateTicketTypeSchema),
    ticketTypeController.update
);

// DELETE /api/ticket-types/:id
router.delete(
    '/:id',
    ticketTypeController.remove
);

module.exports = router;