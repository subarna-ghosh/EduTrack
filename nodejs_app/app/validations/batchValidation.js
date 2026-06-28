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

  status: Joi.string().valid("active", "completed", "upcoming").optional(),
});

const batchScheduleValidation = Joi.object({
  batchId: Joi.string().hex().length(24).required().messages({
    "any.required": "Batch is required",
    "string.hex": "Invalid Batch ID",
    "string.length": "Invalid Batch ID",
  }),

  facultyId: Joi.string().hex().length(24).required().messages({
    "any.required": "Faculty is required",
    "string.hex": "Invalid Faculty ID",
    "string.length": "Invalid Faculty ID",
  }),

  day: Joi.string()
    .valid(
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    )
    .required(),

  startTime: Joi.string().required().messages({
    "any.required": "Start time is required",
  }),

  endTime: Joi.string().required().messages({
    "any.required": "End time is required",
  }),

  topic: Joi.string().trim().max(200).required(),

  meetingLink: Joi.string().uri().allow("").optional(),
});

module.exports = { batchSchema, batchScheduleValidation };
