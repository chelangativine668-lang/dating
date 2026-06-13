
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function RequestTracking() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      const res = await API.get(
        `/match/user-dashboard/${user.id}`
      );

      setRequests(
        res.data.requests || []
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

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "#4ade80";

      case "rejected":
        return "#ef4444";

      default:
        return "#f59e0b";
    }
  };

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyState}>
          <h2>Please login first</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <h2>Loading requests...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          📌 Request Tracking
        </h1>

        <p style={styles.heroSubtitle}>
          Monitor your match requests,
          admin feedback and partner
          connections in one place.
        </p>
      </div>

      {requests.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No requests found</h3>
          <p>
            You have not submitted any
            partner requests yet.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {requests.map((request) => (
            <div
              key={request.id}
              style={styles.card}
            >
              <img
                src={
                  request.public_partners
                    ?.profile_image
                }
                alt=""
                style={styles.image}
              />

              <h2 style={styles.name}>
                {
                  request.public_partners
                    ?.name
                }
              </h2>

              <p style={styles.statusText}>
                Status:{" "}
                <span
                  style={{
                    color: getStatusColor(
                      request.status
                    ),
                    fontWeight: "700"
                  }}
                >
                  {request.status}
                </span>
              </p>

              {request.status ===
                "pending" && (
                <div
                  style={
                    styles.pendingBox
                  }
                >
                  Waiting for admin
                  review.
                </div>
              )}

              {request.admin_message && (
                <div
                  style={
                    styles.messageBox
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

              {request.partner_contact && (
                <div
                  style={
                    styles.contactBox
                  }
                >
                  <strong>
                    Partner Contact
                  </strong>

                  <p>
                    {
                      request.partner_contact
                    }
                  </p>
                </div>
              )}

              <div
                style={styles.date}
              >
                Requested:
                <br />
                {new Date(
                  request.created_at
                ).toLocaleString()}
              </div>

              <button
                onClick={() =>
                  openChat(
                    request.id
                  )
                }
                style={
                  styles.chatButton
                }
              >
                Open Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0d0d0d,#1b1b1b)",
    color: "#fff",
    padding: "30px"
  },

  hero: {
    textAlign: "center",
    marginBottom: "50px"
  },

  heroTitle: {
    fontSize: "48px",
    color: "#ff4d6d",
    marginBottom: "15px"
  },

  heroSubtitle: {
    color: "#bbb",
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: "1.8",
    fontSize: "17px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(340px,1fr))",
    gap: "25px"
  },

  card: {
    background:
      "rgba(255,255,255,0.04)",
    backdropFilter: "blur(10px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "25px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.35)"
  },

  image: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    borderRadius: "18px",
    marginBottom: "15px"
  },

  name: {
    marginBottom: "12px",
    color: "#fff"
  },

  statusText: {
    color: "#ddd",
    marginBottom: "15px"
  },

  pendingBox: {
    background:
      "rgba(245,158,11,0.15)",
    border:
      "1px solid rgba(245,158,11,0.3)",
    color: "#f59e0b",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "15px"
  },

  messageBox: {
    background:
      "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "15px"
  },

  contactBox: {
    background:
      "rgba(255,77,109,0.12)",
    border:
      "1px solid rgba(255,77,109,0.3)",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "15px"
  },

  date: {
    color: "#aaa",
    fontSize: "14px",
    marginBottom: "15px"
  },

  chatButton: {
    width: "100%",
    padding: "14px",
    background: "#ff4d6d",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px"
  },

  loadingContainer: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0d0d0d,#1b1b1b)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
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
  },

  emptyState: {
    textAlign: "center",
    background:
      "rgba(255,255,255,0.04)",
    borderRadius: "20px",
    padding: "50px"
  }
};

