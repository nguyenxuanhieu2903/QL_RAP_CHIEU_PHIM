const Joi = require('joi');

const createEmployeeSchema = Joi.object({
    hoTen: Joi.string().required(),
    soDienThoai: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
    chucVu: Joi.string().required(),
    maRap: Joi.number().integer().required()
});

const updateEmployeeSchema = Joi.object({
    hoTen: Joi.string().optional(),
    soDienThoai: Joi.string().pattern(/^[0-9]{10,11}$/).optional(),
    chucVu: Joi.string().optional(),
    maRap: Joi.number().integer().optional()
});

const validateEmployeeCreate = (req, res, next) => {
    const { error } = createEmployeeSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.details[0].message 
        });
    }
    next();
};

const validateEmployeeUpdate = (req, res, next) => {
    const { error } = updateEmployeeSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.details[0].message 
        });
    }
    next();
};

module.exports = {
    validateEmployeeCreate,
    validateEmployeeUpdate
};