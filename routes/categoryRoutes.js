const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Import validation functions
const {
  validateCategory,
  validateUpdateCategory,
} = require("../validation/categoryValidation");
const validate = require("../middleware/validation");

// Routes with validation
router.post("/", validate(validateCategory), createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", validate(validateUpdateCategory), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
