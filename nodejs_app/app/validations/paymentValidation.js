const Joi = require("joi");

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),

  paymentMethod: Joi.string().valid("cash", "upi", "card", "bank").required(),
});

const changePasswordValidation = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
  }),

  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "New password is required",
    "string.min": "Password must be at least 6 characters",
  }),

  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Confirm password does not match",
    "any.required": "Confirm password is required",
  }),
});

const updateProfileValidation = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Enter a valid 10-digit phone number",
    }),

  address: Joi.string().trim().min(5).max(200).required().messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address cannot exceed 200 characters",
  }),
});

const projectSubmissionValidation = Joi.object({
  projectId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Project ID is required.",
    "string.hex": "Invalid Project ID.",
    "string.length": "Invalid Project ID.",
    "any.required": "Project ID is required.",
  }),

  githubLink: Joi.string().uri().allow("", null).messages({
    "string.uri": "Please enter a valid GitHub repository URL.",
  }),

  remarks: Joi.string().trim().max(500).allow("", null).messages({
    "string.max": "Remarks cannot exceed 500 characters.",
  }),
});

module.exports = {
  paymentSchema,
  changePasswordValidation,
  updateProfileValidation,
  projectSubmissionValidation,
};
