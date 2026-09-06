const { errorResponse } = require('../utils/response');

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    const message =
        err.isOperational
            ? err.message
            : 'Internal server error';

    return errorResponse(
        res,
        message,
        statusCode
    );
};

module.exports = errorMiddleware;