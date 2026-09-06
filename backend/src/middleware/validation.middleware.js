const AppError = require('../utils/error');

const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(', ');

            return next(
                new AppError(message, 400)
            );
        }

        req.validated = result.data;

        next();
    };
};

module.exports = {
    validate,
};