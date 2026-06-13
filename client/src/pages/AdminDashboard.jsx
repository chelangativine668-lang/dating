
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AdminDashboard() {
  const { adminId: routeAdminId } = useParams();
  const navigate = useNavigate();

  const adminId =
    routeAdminId || localStorage.getItem("adminId");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (adminId) {
      loadData();
    }
  }, [adminId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/match/dashboard/${adminId}`
      );

      setRequests(res.data.requests || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id, adminMessage) => {
    try {
      await API.post("/match/approve", {
        request_id: id,
        admin_message:
          adminMessage || "Request approved"
      });

      closeModal();
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const reject = async (id, reason) => {
    try {
      await API.post("/match/reject", {
        request_id: id,
        reason: reason || "Request rejected"
      });

      closeModal();
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (type, requestId) => {
    setModalType(type);
    setSelectedRequest(requestId);
    setMessage("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
    setMessage("");
  };

  const submitModal = () => {
    if (!selectedRequest) return;

    if (modalType === "approve") {
      approve(selectedRequest, message);
    }

    if (modalType === "reject") {
      reject(selectedRequest, message);
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

  if (!adminId) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          No admin ID found. Please access via
          admin link.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          {error}
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter(
    (r) => r.status === "pending"
  ).length;

  const connectedCount = requests.filter(
    (r) => r.status === "connected"
  ).length;

  const rejectedCount = requests.filter(
    (r) => r.status === "rejected"
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          ❤️ SoulMatch Admin Dashboard
        </h1>

        <p style={styles.heroSubtitle}>
          Review requests, manage partner
          connections and support users.
        </p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h2>{requests.length}</h2>
          <p>Total Requests</p>
        </div>

        <div style={styles.statCard}>
          <h2>{pendingCount}</h2>
          <p>Pending</p>
        </div>

        <div style={styles.statCard}>
          <h2>{connectedCount}</h2>
          <p>Connected</p>
        </div>

        <div style={styles.statCard}>
          <h2>{rejectedCount}</h2>
          <p>Rejected</p>
        </div>
      </div>

      {requests.length === 0 && (
        <div style={styles.emptyState}>
          No requests available.
        </div>
      )}

      {requests.map((r) => (
        <div key={r.id} style={styles.card}>
          <div style={styles.cardTop}>
            <div>
              <h3>User Information</h3>

              <p>
                <strong>Name:</strong>{" "}
                {r.users?.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {r.users?.email}
              </p>
            </div>

            <div
              style={{
                ...styles.statusBadge,
                background:
                  getStatusColor(r.status)
              }}
            >
              {r.status}
            </div>
          </div>

          <div style={styles.divider} />

          <h3>Partner Requested</h3>

          <img
            src={
              r.public_partners?.profile_image
            }
            alt=""
            style={styles.image}
          />

          <p>
            <strong>Name:</strong>{" "}
            {r.public_partners?.name}
          </p>

          <p>
            {r.public_partners?.gender} •{" "}
            {r.public_partners?.age}
          </p>

          <p>
            {r.public_partners?.country}
          </p>

          <p>
            {r.public_partners?.occupation}
          </p>

          <div style={styles.divider} />

          <p>
            <strong>User Request</strong>
          </p>

          <div style={styles.messageBox}>
            {r.user_message ||
              "No request message provided"}
          </div>

          {r.admin_message && (
            <>
              <p
                style={{
                  marginTop: "15px"
                }}
              >
                <strong>
                  Admin Response
                </strong>
              </p>

              <div style={styles.adminBox}>
                {r.admin_message}
              </div>
            </>
          )}

          <div style={styles.buttons}>
            <button
              style={styles.approveBtn}
              onClick={() =>
                openModal(
                  "approve",
                  r.id
                )
              }
            >
              ✅ Approve
            </button>

            <button
              style={styles.rejectBtn}
              onClick={() =>
                openModal(
                  "reject",
                  r.id
                )
              }
            >
              ❌ Reject
            </button>

            <button
              style={styles.chatBtn}
              onClick={() =>
                openChat(r.id)
              }
            >
              💬 Open Chat
            </button>
          </div>
        </div>
      ))}

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>
              {modalType === "approve"
                ? "Approve Request"
                : "Reject Request"}
            </h2>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              placeholder={
                modalType === "approve"
                  ? "Enter approval message..."
                  : "Enter rejection reason..."
              }
              style={styles.textarea}
            />

            <div style={styles.modalButtons}>
              <button
                style={styles.cancelBtn}
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                style={
                  modalType === "approve"
                    ? styles.approveBtn
                    : styles.rejectBtn
                }
                onClick={submitModal}
              >
                Confirm
              </button>
            </div>
          </div>
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
    marginBottom: "40px"
  },

  heroTitle: {
    fontSize: "48px",
    color: "#ff4d6d",
    marginBottom: "10px"
  },

  heroSubtitle: {
    color: "#bbb",
    fontSize: "17px"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: "20px",
    marginBottom: "35px"
  },

  statCard: {
    background:
      "rgba(255,255,255,0.04)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
    textAlign: "center"
  },

  card: {
    background:
      "rgba(255,255,255,0.04)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "25px",
    backdropFilter: "blur(10px)"
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap"
  },

  statusBadge: {
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "700",
    textTransform: "capitalize"
  },

  divider: {
    height: "1px",
    background:
      "rgba(255,255,255,0.08)",
    margin: "20px 0"
  },

  image: {
    width: "180px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "18px",
    marginBottom: "15px"
  },

  messageBox: {
    background:
      "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "12px"
  },

  adminBox: {
    background:
      "rgba(255,77,109,0.12)",
    border:
      "1px solid rgba(255,77,109,0.25)",
    padding: "15px",
    borderRadius: "12px"
  },

  buttons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "20px"
  },

  approveBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  rejectBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  chatBtn: {
    background: "#ff4d6d",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },

  modal: {
    background: "#1b1b1b",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "25px",
    width: "90%",
    maxWidth: "500px"
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    marginTop: "15px",
    background: "#111",
    color: "#fff",
    border:
      "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px"
  },

  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px"
  },

  cancelBtn: {
    background: "#444",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer"
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
    padding: "50px",
    background:
      "rgba(255,255,255,0.04)",
    borderRadius: "20px"
  },

  errorBox: {
    background:
      "rgba(239,68,68,0.15)",
    border:
      "1px solid rgba(239,68,68,0.3)",
    color: "#ef4444",
    padding: "20px",
    borderRadius: "15px"
  }
};

