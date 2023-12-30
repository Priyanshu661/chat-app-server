const express = require("express");
const { send_message, fetch_messages, fetch_users, create_group, fetch_chat_messages, fetch_all_groups, fetch_groups_details, update_groups_details } = require("../controllers/message");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post("/send-message",authenticate, send_message);
router.get("/fetch", authenticate, fetch_messages);
router.get("/fetch-users-for-group", authenticate, fetch_users);
router.post("/create-group", authenticate, create_group);

router.get("/fetch-chat-messages", authenticate, fetch_chat_messages);

router.get("/fetch-all-groups", authenticate, fetch_all_groups);
router.get("/fetch-group-details/:id", authenticate, fetch_groups_details);
router.put("/update-group-details/:id", authenticate, update_groups_details);








module.exports = router;
