const Joi = require("joi");

// Category validation schema
const categorySchema = Joi.object({
  name: Joi.string().trim().required().min(1).max(100).messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 1 character long",
    "string.max": "Category name cannot exceed 100 characters",
    "any.required": "Category name is required",
  }),

  description: Joi.string().trim().allow("").max(500).default("").messages({
    "string.max": "Category description cannot exceed 500 characters",
  }),
});

// Update category validation schema (all fields optional)
const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).messages({
    "string.min": "Category name must be at least 1 character long",
    "string.max": "Category name cannot exceed 100 characters",
  }),

  description: Joi.string().trim().allow("").max(500).messages({
    "string.max": "Category description cannot exceed 500 characters",
  }),
});

// Validation functions
const validateCategory = (data) => {
  return categorySchema.validate(data, { abortEarly: false });
};

const validateUpdateCategory = (data) => {
  return updateCategorySchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateCategory,
  validateUpdateCategory,
  categorySchema,
  updateCategorySchema,
};
