const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getChat
} = require("../controllers/chatController");

// ✅ SEND MESSAGE
router.post("/send", sendMessage);

// ✅ GET CHAT HISTORY (kept compatible with frontend requestId)
router.get("/:requestId", (req, res, next) => {
  // normalize param name for controller consistency
  req.params.match_request_id = req.params.requestId;
  return getChat(req, res, next);
});

module.exports = router;