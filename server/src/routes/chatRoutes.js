const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getChat
} = require("../controllers/chatController");

router.post("/send", sendMessage);

router.get("/:match_request_id", getChat);

module.exports = router;