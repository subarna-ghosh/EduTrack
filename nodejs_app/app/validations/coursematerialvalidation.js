const Joi = require("joi");

const coursematerialSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Title name is required",
    "any.required": "Title name is required",
  }),

  description: Joi.string().trim().required().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),

  batchId: Joi.string().hex().length(24).required().messages({
    "any.required": "Batch is required",
  }),

  facultyId: Joi.string().hex().length(24).required().messages({
    "any.required": "Batch is required",
  }),

});

module.exports = {coursematerialSchema};