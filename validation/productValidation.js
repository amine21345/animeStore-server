const Joi = require("joi");

// Product validation schema
const productSchema = Joi.object({
  name: Joi.string().trim().required().min(1).max(255).messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 1 character long",
    "string.max": "Product name cannot exceed 255 characters",
    "any.required": "Product name is required",
  }),

  description: Joi.string().required().min(10).max(1000).messages({
    "string.empty": "Product description is required",
    "string.min": "Product description must be at least 10 characters long",
    "string.max": "Product description cannot exceed 1000 characters",
    "any.required": "Product description is required",
  }),

  price: Joi.number().required().min(0).positive().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),

  sizes: Joi.array().items(Joi.string().trim()).default([]).messages({
    "array.base": "Sizes must be an array of strings",
  }),

  colors: Joi.array().items(Joi.string().trim()).default([]).messages({
    "array.base": "Colors must be an array of strings",
  }),

  categorieId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Category ID is required",
      "string.pattern.base": "Category ID must be a valid MongoDB ObjectId",
      "any.required": "Category ID is required",
    }),

  image: Joi.string().required().uri().messages({
    "string.empty": "Image URL is required",
    "string.uri": "Image must be a valid URL",
    "any.required": "Image URL is required",
  }),

  quantity_sold: Joi.number().min(0).default(0).messages({
    "number.base": "Quantity sold must be a number",
    "number.min": "Quantity sold cannot be negative",
  }),
});

// Update product validation schema (all fields optional except ID)
const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).messages({
    "string.min": "Product name must be at least 1 character long",
    "string.max": "Product name cannot exceed 255 characters",
  }),

  description: Joi.string().min(10).max(1000).messages({
    "string.min": "Product description must be at least 10 characters long",
    "string.max": "Product description cannot exceed 1000 characters",
  }),

  price: Joi.number().min(0).positive().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "number.positive": "Price must be a positive number",
  }),

  sizes: Joi.array().items(Joi.string().trim()).messages({
    "array.base": "Sizes must be an array of strings",
  }),

  colors: Joi.array().items(Joi.string().trim()).messages({
    "array.base": "Colors must be an array of strings",
  }),

  categorieId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Category ID must be a valid MongoDB ObjectId",
    }),

  image: Joi.string().uri().messages({
    "string.uri": "Image must be a valid URL",
  }),

  quantity_sold: Joi.number().min(0).messages({
    "number.base": "Quantity sold must be a number",
    "number.min": "Quantity sold cannot be negative",
  }),
});

// Validation functions
const validateProduct = (data) => {
  return productSchema.validate(data, { abortEarly: false });
};

const validateUpdateProduct = (data) => {
  return updateProductSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateProduct,
  validateUpdateProduct,
  productSchema,
  updateProductSchema,
};
