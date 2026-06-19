const Joi = require("joi");

const saveLoginSchema = Joi.object({
    
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long",
      "any.required": "Password is required",
    }),
});

module.exports = {
  saveLoginSchema,
};
