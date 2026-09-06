const authService = require('./auth.service');
const { successResponse } = require('../../utils/response');

const register = async (req, res, next) => {
    try {
        const result =
            await authService.register(
                req.validated.body
            );

        return successResponse(
            res,
            result,
            'Register successfully',
            201
        );
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result =
            await authService.login(
                req.validated.body
            );

        return successResponse(
            res,
            result,
            'Login successfully'
        );
    } catch (error) {
        next(error);
    }
};

const me = async (req, res, next) => {
    try {
        const result =
            await authService.getMe(
                req.user.userId
            );

        return successResponse(
            res,
            result,
            'Get current user successfully'
        );
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res) => {
    return successResponse(
        res,
        null,
        'Logout successfully'
    );
};

module.exports = {
    register,
    login,
    me,
    logout,
};