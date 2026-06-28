const Joi = require("joi");

const projectSchema = Joi.object({
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

  dueDate: Joi.date().required().greater(Joi.ref("startDate")).messages({
    "date.greater": "End date must be greater than start date",
    "any.required": "End date is required",
  }),

  status: Joi.string()
    .valid("active", "closed")
    .optional(),
});

module.exports = {projectSchema};