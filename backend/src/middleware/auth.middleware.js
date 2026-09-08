const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/error');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(
                'Authorization header is required',
                401
            );
        }

        const [scheme, token] = authHeader.split(' ');

        if (scheme !== 'Bearer' || !token) {
            throw new AppError(
                'Invalid authorization format',
                401
            );
        }

        const decoded = verifyToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        next(
            error instanceof AppError
                ? error
                : new AppError('Invalid or expired token', 401)
        );
    }
};

module.exports = {
    authenticate,
};
