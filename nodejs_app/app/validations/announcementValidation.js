const Joi = require("joi");

const announcementSchema = Joi.object({
  title: Joi.string().trim().required(),

  description: Joi.string().trim().required(),

  status: Joi.string().valid("active", "inactive").optional(),

  announcementType: Joi.string()
    .valid("global", "student", "faculty", "batch")
    .required(),

  batchId: Joi.when("announcementType", {
    is: "batch",
    then: Joi.string().required(),
    otherwise: Joi.string().allow("", null),
  }),
});

module.exports = { announcementSchema };
