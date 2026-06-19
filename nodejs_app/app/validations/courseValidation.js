const Joi = require("joi");

const courseSchema = Joi.object({
  courseName: Joi.string().min(3).max(100).required(),

  duration: Joi.string()
    .pattern(/^\d+\s+(Months|Weeks|Years)$/)
    .required(),

  fees: Joi.number().min(0).required(),

  description: Joi.string().min(10).required(),

  status: Joi.string().valid("active", "inactive").required(),
});

module.exports = {
  courseSchema,
};
