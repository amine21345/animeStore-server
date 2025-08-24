const Joi = require("joi");

// Reusable URL validator
const urlItem = Joi.string().uri().messages({
  "string.uri": "Image must be a valid URL",
  "string.base": "Image must be a valid URL",
});

// Accept either an array of URLs (min 1) or a single URL
const imageField = Joi.alternatives()
  .try(
    Joi.array().items(urlItem).min(1).messages({
      "array.base": "Image must be an array of URLs",
      "array.min": "At least one image URL is required",
    }),
    urlItem // single URL
  )
  .custom((value, helpers) => {
    // optional: normalize a single URL to an array so downstream is always array
    if (typeof value === "string") return [value];
    return value;
  });

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Category ID must be a valid MongoDB ObjectId",
  });

// CREATE
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

  // Allow 0 if your DB allows min: 0. Remove .min(0) and keep .positive() if you want strictly > 0.
  price: Joi.number().required().min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),

  sizes: Joi.array().items(Joi.string().trim()).default([]).messages({
    "array.base": "Sizes must be an array of strings",
  }),

  colors: Joi.array().items(Joi.string().trim()).default([]).messages({
    "array.base": "Colors must be an array of strings",
  }),

  // NOTE: your field is spelled `categorieId` (with 'ie'), keep it consistent
  categorieId: objectId.required().messages({
    "string.empty": "Category ID is required",
    "any.required": "Category ID is required",
  }),

  // Make this accept array or single url; normalized to array by custom() above
  image: imageField.required().messages({
    "any.required": "Image URL is required",
  }),

  quantity_sold: Joi.number().min(0).default(0).messages({
    "number.base": "Quantity sold must be a number",
    "number.min": "Quantity sold cannot be negative",
  }),
});

// UPDATE (all optional)
const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).messages({
    "string.min": "Product name must be at least 1 character long",
    "string.max": "Product name cannot exceed 255 characters",
  }),

  description: Joi.string().min(10).max(1000).messages({
    "string.min": "Product description must be at least 10 characters long",
    "string.max": "Product description cannot exceed 1000 characters",
  }),

  // Keep aligned with create
  price: Joi.number().min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),

  sizes: Joi.array().items(Joi.string().trim()).messages({
    "array.base": "Sizes must be an array of strings",
  }),

  colors: Joi.array().items(Joi.string().trim()).messages({
    "array.base": "Colors must be an array of strings",
  }),

  categorieId: objectId.messages({
    "string.pattern.base": "Category ID must be a valid MongoDB ObjectId",
  }),

  image: imageField.messages({
    "array.base": "Image must be an array of URLs",
  }),

  quantity_sold: Joi.number().min(0).messages({
    "number.base": "Quantity sold must be a number",
    "number.min": "Quantity sold cannot be negative",
  }),
});

const validateProduct = (data) => productSchema.validate(data, { abortEarly: false });
const validateUpdateProduct = (data) =>
  updateProductSchema.validate(data, { abortEarly: false });

module.exports = {
  validateProduct,
  validateUpdateProduct,
  productSchema,
  updateProductSchema,
};
