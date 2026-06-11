import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const { requestId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId && user) {
      loadChat();
    }
  }, [requestId, user]);

  const loadChat = async () => {
    try {
      setLoading(true);

      const requestRes = await API.get(
        `/match/request/${requestId}`
      );

      const request = requestRes.data?.request;

      // ✅ STEP 1: DB admin_id
      if (request?.admin_id) {
        setAdminId(request.admin_id);
      } 
      // ✅ STEP 2: fallback from URL system (Home.jsx stored)
      else {
        const storedAdminId = localStorage.getItem("adminId");
        if (storedAdminId) {
          setAdminId(storedAdminId);
        }
      }

      const chatRes = await API.get(
        `/chat/${requestId}`
      );

      setMessages(chatRes.data.messages || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await API.post("/chat/send", {
        match_request_id: requestId,
        sender_id: user.id,
        receiver_id: adminId, // ✅ ALWAYS LINKED TO URL ADMIN SYSTEM
        message: text
      });

      setText("");
      loadChat();

    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  if (!user) {
    return <div>Please login first</div>;
  }

  if (loading) {
    return <div>Loading chat...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>💬 Chat With Admin</h2>

      <div style={styles.chatBox}>
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.message,
                alignSelf:
                  msg.sender_id === user.id
                    ? "flex-end"
                    : "flex-start",
                backgroundColor:
                  msg.sender_id === user.id
                    ? "#DCF8C6"
                    : "#fff"
              }}
            >
              {msg.message}
            </div>
          ))
        )}
      </div>

      <div style={styles.inputBox}>
        <input
          value={text}
          placeholder="Type message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
          style={styles.input}
        />

        <button
          onClick={sendMessage}
          style={styles.button}
        >
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  chatBox: {
    height: "450px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    background: "#f5f5f5"
  },
  message: {
    padding: "10px",
    margin: "5px 0",
    borderRadius: "10px",
    maxWidth: "70%",
    wordBreak: "break-word"
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px"
  },
  button: {
    padding: "10px 20px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};