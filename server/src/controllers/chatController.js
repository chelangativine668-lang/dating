const supabase = require("../config/supabase");

/**

* SEND MESSAGE
  */
  const sendMessage = async (req, res) => {
  try {
  const {
  match_request_id,
  sender_id,
  receiver_id,
  message
  } = req.body;

  // VALIDATION
  if (
  !match_request_id ||
  !sender_id ||
  !receiver_id ||
  !message ||
  typeof message !== "string" ||
  !message.trim()
  ) {
  return res.status(400).json({
  message: "All fields required"
  });
  }

  // VERIFY REQUEST EXISTS
  const {
  data: request,
  error: requestError
  } = await supabase
  .from("match_requests")
  .select("*")
  .eq("id", match_request_id)
  .single();

  if (requestError || !request) {
  return res.status(404).json({
  message: "Match request not found"
  });
  }

  // SECURITY CHECK
  const isParticipant =
  request.user_id === sender_id ||
  request.admin_id === sender_id;

  if (!isParticipant) {
  return res.status(403).json({
  message: "Unauthorized sender"
  });
  }

  const { data, error } = await supabase
  .from("chat_messages")
  .insert([
  {
  match_request_id,
  sender_id,
  receiver_id,
  message: message.trim(),
  is_read: false
  }
  ])
  .select()
  .single();

  if (error) {
  return res.status(400).json({
  error: error.message
  });
  }

  res.json({
  message: "Message sent",
  data
  });

} catch (err) {
res.status(500).json({
error: err.message
});
}
};

/**

* GET CHAT HISTORY
  */
  const getChat = async (req, res) => {
  try {
  const { match_request_id } = req.params;

  if (!match_request_id) {
  return res.status(400).json({
  message: "match_request_id is required"
  });
  }

  const { data, error } = await supabase
  .from("chat_messages")
  .select("*")
  .eq(
  "match_request_id",
  match_request_id
  )
  .order("created_at", {
  ascending: true
  });

  if (error) {
  return res.status(400).json({
  error: error.message
  });
  }

  res.json({
  message: "Chat loaded",
  messages: data || []
  });

} catch (err) {
res.status(500).json({
error: err.message
});
}
};

/**

* MARK MESSAGES AS READ
  */
  const markAsRead = async (req, res) => {
  try {
  const {
  match_request_id,
  receiver_id
  } = req.body;

  const { error } = await supabase
  .from("chat_messages")
  .update({
  is_read: true
  })
  .eq(
  "match_request_id",
  match_request_id
  )
  .eq(
  "receiver_id",
  receiver_id
  )
  .eq(
  "is_read",
  false
  );

  if (error) {
  return res.status(400).json({
  error: error.message
  });
  }

  res.json({
  message: "Messages marked as read"
  });

} catch (err) {
res.status(500).json({
error: err.message
});
}
};

/**

* GET UNREAD COUNTS
  */
  const getUnreadCounts = async (req, res) => {
  try {
  const { receiver_id } = req.params;

  const { data, error } = await supabase
  .from("chat_messages")
  .select(
  "match_request_id,is_read"
  )
  .eq(
  "receiver_id",
  receiver_id
  )
  .eq(
  "is_read",
  false
  );

  if (error) {
  return res.status(400).json({
  error: error.message
  });
  }

  const counts = {};

  (data || []).forEach((msg) => {
  counts[msg.match_request_id] =
  (counts[msg.match_request_id] || 0) + 1;
  });

  res.json({
  counts
  });

} catch (err) {
res.status(500).json({
error: err.message
});
}
};

module.exports = {
sendMessage,
getChat,
markAsRead,
getUnreadCounts
};
