const express = require("express");
const router = express.Router();
const { sendTestEmail } = require("../controllers/mailController");

router.post("/send", sendTestEmail);

module.exports = router;
