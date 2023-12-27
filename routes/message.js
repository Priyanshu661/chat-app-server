const express = require("express");
const { send_message, fetch_messages, fetch_users } = require("../controllers/message");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post("/send-message",authenticate, send_message);
router.get("/fetch", authenticate, fetch_messages);
router.get("/fetch-users-for-group", authenticate, fetch_users);



module.exports = router;
