const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Import validation functions
const {
  validateProduct,
  validateUpdateProduct,
} = require("../validation/productValidation");
const validate = require("../middleware/validation");

// Routes with validation
router.post("/", validate(validateProduct), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", validate(validateUpdateProduct), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
