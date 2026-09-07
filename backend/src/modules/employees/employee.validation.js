const Joi = require('joi');

const employeeValidationSchema = Joi.object({
    hoTen: Joi.string().required(),
    soDienThoai: Joi.string().pattern(/^[0-9]{10}$/).required(),
    email: Joi.string().email().required(),
    matKhau: Joi.string().min(6).required(),
    chucVu: Joi.string().required()
});

const validateEmployee = (req, res, next) => {
    const { error } = employeeValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateEmployee
};