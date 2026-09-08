const verifyToken = (req, res, next) => {
    return next();
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        return next();
    };
};

module.exports = { verifyToken, authorize };