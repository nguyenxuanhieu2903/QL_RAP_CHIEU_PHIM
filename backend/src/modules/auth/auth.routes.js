const express = require('express');

const authController = require('./auth.controller');

const {
    registerSchema,
    loginSchema,
} = require('./auth.validation');

const {
    authenticate,
} = require('../../middleware/auth.middleware');

const {
    validate,
} = require('../../middleware/validation.middleware');

const router = express.Router();

router.post(
    '/register',
    validate(registerSchema),
    authController.register
);

router.post(
    '/login',
    validate(loginSchema),
    authController.login
);

router.get(
    '/me',
    authenticate,
    authController.me
);

router.post(
    '/logout',
    authenticate,
    authController.logout
);

module.exports = router;