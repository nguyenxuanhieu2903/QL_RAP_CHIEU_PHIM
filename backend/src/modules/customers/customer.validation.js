const Joi = require('joi');

const updateCustomerSchema = Joi.object({
    hoTen: Joi.string().optional(),
    soDienThoai: Joi.string().pattern(/^[0-9]{10,11}$/).optional(),
    email: Joi.string().email().optional()
});

const validateCustomerUpdate = (req, res, next) => {
    const { error } = updateCustomerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.details[0].message 
        });
    }
    next();
};

module.exports = {
    validateCustomerUpdate
};