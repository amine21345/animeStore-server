const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Register endpoint disabled for security
// router.post("/register", userController.register);
// Login
router.post("/login", userController.login);

module.exports = router;
