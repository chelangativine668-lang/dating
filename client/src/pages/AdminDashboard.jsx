import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function AdminDashboard() {
  const { adminId: routeAdminId } = useParams();

  // ✅ FALLBACK SYSTEM (VERY IMPORTANT)
  const adminId =
    routeAdminId || localStorage.getItem("adminId");

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (adminId) {
      loadData();
    }
  }, [adminId]);

  const loadData = async () => {
    try {
      const res = await API.get(`/match/dashboard/${adminId}`);
      setRequests(res.data.requests);
    } catch (err) {
      console.log(err);
    }
  };

  const approve = async (id) => {
    await API.post("/match/approve", { request_id: id });
    loadData();
  };

  const reject = async (id) => {
    await API.post("/match/reject", { request_id: id });
    loadData();
  };

  if (!adminId) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        No admin ID found. Please access via admin link.
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard (ID: {adminId})</h2>

      {requests.map((r) => (
        <div key={r.id} style={styles.card}>
          <h3>User</h3>
          <p>{r.users?.name}</p>
          <p>{r.users?.email}</p>

          <hr />

          <h3>Partner</h3>
          <img
            src={r.public_partners?.profile_image}
            style={{ width: "150px" }}
          />
          <p>{r.public_partners?.name}</p>
          <p>
            {r.public_partners?.gender} • {r.public_partners?.age}
          </p>
          <p>{r.public_partners?.country}</p>
          <p>{r.public_partners?.occupation}</p>

          <p>Status: {r.status}</p>

          <div style={styles.buttons}>
            <button onClick={() => approve(r.id)}>Approve</button>
            <button onClick={() => reject(r.id)}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "10px"
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  }
};