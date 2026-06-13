const express = require("express");
const router = express.Router();

const {
sendMessage,
getChat,
markAsRead,
getUnreadCounts
} = require("../controllers/chatController");

// ✅ SEND MESSAGE
router.post("/send", sendMessage);

// ✅ MARK CHAT AS READ
router.post("/mark-read", markAsRead);

// ✅ GET UNREAD COUNTS
router.get(
"/unread/:receiver_id",
getUnreadCounts
);

// ✅ GET CHAT HISTORY
router.get("/:requestId", (req, res, next) => {
req.params.match_request_id =
req.params.requestId;

return getChat(req, res, next);
});

module.exports = router;
