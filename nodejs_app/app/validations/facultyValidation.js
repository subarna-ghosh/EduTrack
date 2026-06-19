const Joi = require("joi");

const departmentSchema = Joi.object({
  deptName: Joi.string().min(4).max(50).required(),
});

const facultySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  address: Joi.string().min(5).max(200).required(),
  deptId: Joi.string().hex().length(24).required(),
  experience: Joi.number().min(0).max(50).required(),
});

module.exports = { departmentSchema, facultySchema };
