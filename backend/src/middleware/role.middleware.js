const AppError = require('../utils/error');

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new AppError('Authentication required', 401)
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new AppError('Access denied', 403)
            );
        }

        next();
    };
};

module.exports = {
    authorizeRoles,
};