const express = require("express");
const { send_message, fetch_messages } = require("../controllers/message");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post("/send-message",authenticate, send_message);
router.get("/fetch", authenticate, fetch_messages);


module.exports = router;
