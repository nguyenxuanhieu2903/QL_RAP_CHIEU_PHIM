const promotionService =
    require('./promotion.service');

const {
    successResponse,
} = require('../../utils/response');

// GET /api/promotions
const getAll = async (req, res, next) => {
    try {
        const result =
            await promotionService.getAllPromotions();

        return successResponse(
            res,
            result,
            'Get promotions successfully'
        );
    } catch (error) {
        next(error);
    }
};

// GET /api/promotions/active
const getActive = async (req, res, next) => {
    try {
        const result =
            await promotionService.getActivePromotions();

        return successResponse(
            res,
            result,
            'Get active promotions successfully'
        );
    } catch (error) {
        next(error);
    }
};

// GET /api/promotions/:id
const getById = async (req, res, next) => {
    try {
        const result =
            await promotionService.getPromotionById(
                Number(req.params.id)
            );

        return successResponse(
            res,
            result,
            'Get promotion successfully'
        );
    } catch (error) {
        next(error);
    }
};

// POST /api/promotions
const create = async (req, res, next) => {
    try {
        const result =
            await promotionService.createPromotion(
                req.validated.body
            );

        return successResponse(
            res,
            result,
            'Create promotion successfully',
            201
        );
    } catch (error) {
        next(error);
    }
};

// PUT /api/promotions/:id
const update = async (req, res, next) => {
    try {
        const result =
            await promotionService.updatePromotion(
                Number(req.params.id),
                req.validated.body
            );

        return successResponse(
            res,
            result,
            'Update promotion successfully'
        );
    } catch (error) {
        next(error);
    }
};

// DELETE /api/promotions/:id
const remove = async (req, res, next) => {
    try {
        const result =
            await promotionService.deletePromotion(
                Number(req.params.id)
            );

        return successResponse(
            res,
            result,
            'Delete promotion successfully'
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getActive,
    getById,
    create,
    update,
    remove,
};