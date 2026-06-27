const Joi = require("joi");

const paymentSchema = Joi.object({

  amount: Joi.number().positive().required(),

  paymentMethod: Joi.string().valid("cash", "upi", "card", "bank").required(),
});

module.exports = { paymentSchema };
