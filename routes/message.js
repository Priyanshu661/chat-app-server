const express = require("express");
const { send_message } = require("../controllers/message");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post("/send-message",authenticate, send_message);

module.exports = router;
