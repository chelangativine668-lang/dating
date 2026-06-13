import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const { requestId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] =
    useState([]);

  const [requestData, setRequestData] =
    useState(null);

  const [text, setText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [feedback, setFeedback] =
    useState("");

  const [feedbackType, setFeedbackType] =
    useState("error");

  const chatEndRef = useRef(null);

  const isAdmin =
    user?.role === "admin";

  useEffect(() => {
    if (requestId && user?.id) {
      loadChat(true);
    }
  }, [requestId, user?.id]);

  useEffect(() => {
    if (!requestId || !user?.id)
      return;

    const interval =
      setInterval(() => {
        loadChat(false);
      }, 5000);

    return () =>
      clearInterval(interval);
  }, [requestId, user?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView(
      {
        behavior: "smooth"
      }
    );
  }, [messages]);

  const markMessagesAsRead =
    async () => {
      try {
        await API.post(
          "/chat/mark-read",
          {
            match_request_id:
              requestId,
            receiver_id:
              user.id
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

  const loadChat = async (
    showLoader = false
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const requestRes =
        await API.get(
          `/match/request/${requestId}`
        );

      const request =
        requestRes.data?.request;

      if (request) {
        setRequestData(
          request
        );
      }

      const chatRes =
        await API.get(
          `/chat/${requestId}`
        );

      setMessages(
        chatRes.data.messages ||
          []
      );

      await markMessagesAsRead();

    } catch (err) {
      console.error(err);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const sendMessage =
    async () => {
      if (!text.trim()) return;

      if (!requestData) {
        setFeedbackType(
          "error"
        );
        setFeedback(
          "Request data not loaded."
        );
        return;
      }

      try {
        let receiverId;

        if (isAdmin) {
          receiverId =
            requestData.user_id;
        } else {
          receiverId =
            requestData.admin_id;
        }

        await API.post(
          "/chat/send",
          {
            match_request_id:
              requestId,
            sender_id: user.id,
            receiver_id:
              receiverId,
            message: text
          }
        );

        setText("");
        setFeedback("");

        await loadChat(false);

      } catch (err) {
        console.error(err);

        setFeedbackType(
          "error"
        );

        setFeedback(
          "Failed to send message."
        );
      }
    };

  if (!user) {
    return (
      <div style={styles.loading}>
        Please login first.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        <div
          style={
            styles.spinner
          }
        />
        <h2>
          Loading chat...
        </h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div
          style={styles.header}
        >
          <h2>
            {isAdmin
              ? "💬 Admin Chat"
              : "💬 Chat With Admin"}
          </h2>
        </div>

        {feedback && (
          <div
            style={{
              ...styles.feedback,
              background:
                feedbackType ===
                "error"
                  ? "#842029"
                  : "#0f5132"
            }}
          >
            {feedback}
          </div>
        )}

        <div style={styles.chatBox}>
          {messages.length ===
          0 ? (
            <div
              style={
                styles.emptyState
              }
            >
              No messages yet
            </div>
          ) : (
            messages.map(
              (msg) => (
                <div
                  key={msg.id}
                  style={{
                    ...styles.message,
                    alignSelf:
                      msg.sender_id ===
                      user.id
                        ? "flex-end"
                        : "flex-start",
                    background:
                      msg.sender_id ===
                      user.id
                        ? "linear-gradient(135deg,#ff4d6d,#ff1f4b)"
                        : "#2a2a2a",
                    color:
                      "#fff"
                  }}
                >
                  {msg.message}
                </div>
              )
            )
          )}

          <div
            ref={chatEndRef}
          />
        </div>

        <div
          style={styles.inputBox}
        >
          <input
            value={text}
            placeholder="Type your message..."
            onChange={(e) =>
              setText(
                e.target.value
              )
            }
            onKeyDown={(e) =>
              e.key ===
                "Enter" &&
              sendMessage()
            }
            style={
              styles.input
            }
          />

          <button
            onClick={
              sendMessage
            }
            style={
              styles.button
            }
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0d0d0d,#1b1b1b)",
    padding: "20px"
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "#181818",
    borderRadius: "20px",
    overflow: "hidden",
    border:
      "1px solid rgba(255,255,255,0.08)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.35)"
  },

  header: {
    padding: "20px",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)",
    color: "#fff"
  },

  chatBox: {
    height: "500px",
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#121212"
  },

  message: {
    padding: "12px 16px",
    borderRadius: "18px",
    maxWidth: "75%",
    wordBreak:
      "break-word",
    fontSize: "15px"
  },

  inputBox: {
    display: "flex",
    gap: "10px",
    padding: "20px",
    background: "#181818"
  },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border:
      "1px solid #333",
    background: "#222",
    color: "#fff",
    outline: "none"
  },

  button: {
    padding:
      "14px 24px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#ff4d6d,#ff1f4b)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },

  feedback: {
    margin: "15px",
    padding: "12px",
    borderRadius: "10px",
    color: "#fff"
  },

  emptyState: {
    color: "#999",
    textAlign: "center",
    marginTop: "50px"
  },

  loading: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0d0d0d,#1b1b1b)",
    display: "flex",
    flexDirection:
      "column",
    justifyContent:
      "center",
    alignItems: "center",
    color: "#fff"
  },

  spinner: {
    width: "45px",
    height: "45px",
    border:
      "4px solid rgba(255,255,255,0.2)",
    borderTop:
      "4px solid #ff4d6d",
    borderRadius: "50%",
    marginBottom: "20px"
  }
};