const ticketTypeService =
    require('./ticket-type.service');

const {
    successResponse,
} = require('../../utils/response');

// GET /api/ticket-types
const getAll = async (req, res, next) => {
    try {
        const result =
            await ticketTypeService.getAllTicketTypes();

        return successResponse(
            res,
            result,
            'Get ticket types successfully'
        );
    } catch (error) {
        next(error);
    }
};

// GET /api/ticket-types/:id
const getById = async (req, res, next) => {
    try {
        const result =
            await ticketTypeService.getTicketTypeById(
                Number(req.params.id)
            );

        return successResponse(
            res,
            result,
            'Get ticket type successfully'
        );
    } catch (error) {
        next(error);
    }
};

// POST /api/ticket-types
const create = async (req, res, next) => {
    try {
        const result =
            await ticketTypeService.createTicketType(
                req.validated.body
            );

        return successResponse(
            res,
            result,
            'Create ticket type successfully',
            201
        );
    } catch (error) {
        next(error);
    }
};

// PUT /api/ticket-types/:id
const update = async (req, res, next) => {
    try {
        const result =
            await ticketTypeService.updateTicketType(
                Number(req.params.id),
                req.validated.body
            );

        return successResponse(
            res,
            result,
            'Update ticket type successfully'
        );
    } catch (error) {
        next(error);
    }
};

// DELETE /api/ticket-types/:id
const remove = async (req, res, next) => {
    try {
        const result =
            await ticketTypeService.deleteTicketType(
                Number(req.params.id)
            );

        return successResponse(
            res,
            result,
            'Delete ticket type successfully'
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};