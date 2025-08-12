const Joi = require("joi");

const orderValidation = {
  create: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    items: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        color: Joi.string().required(),
      })
    ).min(1).required(),
    totalAmount: Joi.number().min(0).required(),
    status: Joi.string().valid("pending", "shipped", "delivered"),
  }),
  updateStatus: Joi.object({
    status: Joi.string().valid("pending", "shipped", "delivered").required(),
  }),
};

module.exports = orderValidation;
