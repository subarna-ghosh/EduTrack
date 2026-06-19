const Joi = require("joi");

const batchSchema = Joi.object({
  batchName: Joi.string().trim().required().messages({
    "string.empty": "Batch name is required",
    "any.required": "Batch name is required",
  }),

  courseId: Joi.string().hex().length(24).required().messages({
    "any.required": "Course is required",
  }),

  facultyId: Joi.string().hex().length(24).required().messages({
    "any.required": "Faculty is required",
  }),

  startDate: Joi.date().required().messages({
    "any.required": "Start date is required",
  }),

  endDate: Joi.date().required().greater(Joi.ref("startDate")).messages({
    "date.greater": "End date must be greater than start date",
    "any.required": "End date is required",
  }),

  status: Joi.string()
    .valid("active", "completed", "upcoming")
    .optional(),
});

module.exports = {batchSchema};