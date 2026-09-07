const express = require('express');
const router = express.Router();
const cinemasController = require('./cinemas.controller');
const { validateCreateCinema, validateUpdateCinema } = require('./cinemas.validation');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const ROLES = require('../../constants/role.constant');

// Public routes
router.get('/', cinemasController.getAll.bind(cinemasController));
router.get('/stats', cinemasController.getStats.bind(cinemasController));
router.get('/:id', cinemasController.getById.bind(cinemasController));

// Admin only routes
router.post(
    '/',
    authenticate,
    authorize(ROLES.ADMIN),
    validateCreateCinema,
    cinemasController.create.bind(cinemasController)
);

router.put(
    '/:id',
    authenticate,
    authorize(ROLES.ADMIN),
    validateUpdateCinema,
    cinemasController.update.bind(cinemasController)
);

router.delete(
    '/:id',
    authenticate,
    authorize(ROLES.ADMIN),
    cinemasController.delete.bind(cinemasController)
);

module.exports = router;