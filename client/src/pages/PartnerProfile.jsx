import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function PartnerProfile() {
  const { id } = useParams();

  const navigate = useNavigate();
  const { user } = useAuth();

  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  // ACTIVE ADMIN ROUTE
  const adminId =
    localStorage.getItem("adminId");

  // ROLE DETECTION
  const isAdmin =
    user?.role === "admin";

  const adminRoute = adminId;

  useEffect(() => {
    fetchPartner();
  }, [id]);

  const fetchPartner = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/partners/${id}`
      );

      setPartner(res.data.partner);
    } catch (err) {
      console.error(
        "Failed to load partner:",
        err
      );

      setMessageType("error");
      setMessage(
        "Failed to load partner profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    try {
      setMessage("");

      if (!user?.id) {
        setMessageType("error");
        setMessage(
          "Please login first."
        );
        return;
      }

      if (!adminRoute) {
        setMessageType("error");
        setMessage(
          "Admin not found. Please open the system through a valid admin link."
        );
        return;
      }

      const res = await API.post(
        "/match/request",
        {
          user_id: user.id,
          partner_id: id,
          admin_route: adminRoute,
          user_message:
            "Request to connect"
        }
      );

      const requestId =
        res.data?.request?.id;

      if (!requestId) {
        setMessageType("error");
        setMessage(
          "Failed to create chat request."
        );
        return;
      }

      navigate(`/chat/${requestId}`);

    } catch (err) {
      console.error(
        "Chat start error:",
        err
      );

      setMessageType("error");

      setMessage(
        err.response?.data?.message ||
          "Failed to start chat"
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (!partner) {
    return (
      <div style={styles.loading}>
        Partner not found
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img
          src={partner.profile_image}
          alt="profile"
          style={styles.image}
        />

        <div style={styles.content}>
          <h1 style={styles.name}>
            {partner.name}
          </h1>

          <p style={styles.bio}>
            {partner.bio}
          </p>

          <div style={styles.infoBox}>
            <div style={styles.infoItem}>
              🎂 {partner.age}
            </div>

            <div style={styles.infoItem}>
              👤 {partner.gender}
            </div>

            <div style={styles.infoItem}>
              📍 {partner.country}
            </div>

            <div style={styles.infoItem}>
              💼 {partner.occupation}
            </div>
          </div>

          {message && (
            <div
              style={{
                ...styles.message,
                background:
                  messageType ===
                  "success"
                    ? "#0f5132"
                    : "#842029",
                border:
                  messageType ===
                  "success"
                    ? "1px solid #198754"
                    : "1px solid #dc3545"
              }}
            >
              {message}
            </div>
          )}

          {!isAdmin && (
            <button
              onClick={startChat}
              style={styles.chatButton}
            >
              💬 Chat with Admin
            </button>
          )}
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
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center"
  },

  card: {
    maxWidth: "900px",
    width: "100%",
    background: "#181818",
    borderRadius: "25px",
    overflow: "hidden",
    boxShadow:
      "0 12px 30px rgba(0,0,0,0.4)",
    border:
      "1px solid rgba(255,255,255,0.08)"
  },

  image: {
    width: "100%",
    height: "450px",
    objectFit: "cover"
  },

  content: {
    padding: "30px"
  },

  name: {
    color: "#fff",
    marginBottom: "15px"
  },

  bio: {
    color: "#bbb",
    lineHeight: "1.8",
    marginBottom: "25px"
  },

  infoBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: "15px",
    marginBottom: "25px"
  },

  infoItem: {
    background: "#222",
    color: "#fff",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center"
  },

  message: {
    color: "#fff",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "15px"
  },

  chatButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#ff4d6d,#ff1f4b)",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer"
  },

  loading: {
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
  }
};