import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminChatDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/match/admin/${user.id}/chats`
      );

      setChats(res.data.chats || []);
    } catch (err) {
      console.error("Admin chat load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (requestId) => {
    navigate(`/chat/${requestId}`);
  };

  if (!user) {
    return <div style={{ padding: 20 }}>Please login</div>;
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading chats...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>🧑‍💼 Admin Chat Dashboard</h2>

      {chats.length === 0 ? (
        <p>No chats found</p>
      ) : (
        chats.map((chat) => (
          <div key={chat.id} style={styles.card}>
            <h3>{chat.users?.name}</h3>

            <p>
              Partner: <b>{chat.public_partners?.name}</b>
            </p>

            <p>Status: {chat.status}</p>

            <button
              style={styles.button}
              onClick={() => openChat(chat.id)}
            >
              Open Chat
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    marginBottom: "10px",
    background: "#f9f9f9"
  },
  button: {
    padding: "8px 12px",
    background: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px"
  }
};