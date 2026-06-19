const Joi = require("joi");

const studentSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).max(30).required(),

  studentCode: Joi.string().min(3).max(20).required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),

  address: Joi.string().min(5).max(200).required(),

  batchId: Joi.string().hex().length(24).required(),

  status: Joi.string().valid("active", "inactive").optional(),
});

module.exports = {
  studentSchema,
};
