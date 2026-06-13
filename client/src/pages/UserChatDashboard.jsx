import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function UserChatDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState([]);

  const [unreadCounts, setUnreadCounts] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (user?.id) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      const res = await API.get(
        `/match/user-dashboard/${user.id}`
      );

      setRequests(
        res.data.requests || []
      );

      const unreadRes =
        await API.get(
          `/chat/unread/${user.id}`
        );

      setUnreadCounts(
        unreadRes.data.counts || {}
      );

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (requestId) => {
    navigate(`/chat/${requestId}`);
  };

  if (!user) {
    return (
      <div style={styles.loading}>
        Please login first
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>

        <h2>Loading chats...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>💬 My Chats</h1>

        <p>
          Manage your conversations
          with SoulMatch admins.
        </p>
      </div>

      {requests.length === 0 ? (
        <div style={styles.empty}>
          <h3>
            No chats available
          </h3>

          <p>
            Start connecting with
            partners to see chats
            here.
          </p>
        </div>
      ) : (
        requests.map((request) => (
          <div
            key={request.id}
            style={styles.card}
          >
            <div
              style={styles.cardTop}
            >
              <div>
                <h2
                  style={
                    styles.partnerName
                  }
                >
                  {
                    request
                      .public_partners
                      ?.name
                  }
                </h2>

                <p
                  style={
                    styles.status
                  }
                >
                  Status:{" "}
                  <span>
                    {
                      request.status
                    }
                  </span>
                </p>
              </div>

              {unreadCounts[
                request.id
              ] > 0 && (
                <div
                  style={
                    styles.badge
                  }
                >
                  {
                    unreadCounts[
                      request.id
                    ]
                  }
                </div>
              )}
            </div>

            {request.admin_message && (
              <div
                style={
                  styles.adminMessage
                }
              >
                <strong>
                  Admin Message
                </strong>

                <p>
                  {
                    request.admin_message
                  }
                </p>
              </div>
            )}

            <button
              onClick={() =>
                openChat(
                  request.id
                )
              }
              style={
                styles.button
              }
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
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0d0d0d,#1b1b1b)",
    padding: "30px",
    color: "#fff"
  },

  header: {
    textAlign: "center",
    marginBottom: "30px"
  },

  card: {
    background: "#181818",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.3)"
  },

  cardTop: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center"
  },

  partnerName: {
    margin: 0,
    color: "#fff"
  },

  status: {
    color: "#bbb",
    marginTop: "8px"
  },

  badge: {
    background:
      "linear-gradient(135deg,#ff4d6d,#ff1f4b)",
    color: "#fff",
    minWidth: "35px",
    height: "35px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    fontWeight: "bold"
  },

  adminMessage: {
    background: "#222",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "15px",
    marginBottom: "15px",
    color: "#ddd"
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#ff4d6d,#ff1f4b)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px"
  },

  empty: {
    textAlign: "center",
    background: "#181818",
    padding: "40px",
    borderRadius: "20px"
  },

  loading: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0d0d0d,#1b1b1b)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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