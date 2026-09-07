const express = require('express');

const promotionController =
    require('./promotion.controller');

const {
    createPromotionSchema,
    updatePromotionSchema,
} = require('./promotion.validation');

const {
    validate,
} = require('../../middleware/validation.middleware');

const router = express.Router();

// GET /api/promotions
router.get(
    '/',
    promotionController.getAll
);

// GET /api/promotions/active
// Phải đặt trước /:id
router.get(
    '/active',
    promotionController.getActive
);

// GET /api/promotions/:id
router.get(
    '/:id',
    promotionController.getById
);

// POST /api/promotions
router.post(
    '/',
    validate(createPromotionSchema),
    promotionController.create
);

// PUT /api/promotions/:id
router.put(
    '/:id',
    validate(updatePromotionSchema),
    promotionController.update
);

// DELETE /api/promotions/:id
router.delete(
    '/:id',
    promotionController.remove
);

module.exports = router;