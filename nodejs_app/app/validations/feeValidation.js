const Joi = require("joi");

const feeSchema = Joi.object({
  studentId: Joi.string().required().messages({
    "string.empty": "Student is required",
    "any.required": "Student is required",
  }),

  totalFee: Joi.number().min(0).required().messages({
    "number.base": "Total fee must be a number",
    "number.min": "Total fee cannot be negative",
    "any.required": "Total fee is required",
  }),

  paidAmount: Joi.number().min(0).default(0).messages({
    "number.base": "Paid amount must be a number",
    "number.min": "Paid amount cannot be negative",
  }),
});

module.exports = { feeSchema };
