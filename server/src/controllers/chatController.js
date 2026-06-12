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

    // ✅ STRICT VALIDATION (prevent empty/invalid messages)
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

    // Verify request exists
    const { data: request, error: requestError } =
      await supabase
        .from("match_requests")
        .select("*")
        .eq("id", match_request_id)
        .single();

    if (requestError || !request) {
      return res.status(404).json({
        message: "Match request not found"
      });
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          match_request_id,
          sender_id,
          receiver_id,
          message: message.trim()
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
      .eq("match_request_id", match_request_id)
      .order("created_at", { ascending: true });

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

module.exports = {
  sendMessage,
  getChat
};