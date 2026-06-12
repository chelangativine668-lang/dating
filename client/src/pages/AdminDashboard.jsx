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

const approve = async (id) => {
try {
const adminMessage = prompt(
"Enter approval message for user:"
);


  await API.post("/match/approve", {
    request_id: id,
    admin_message:
      adminMessage || "Request approved"
  });

  loadData();
} catch (err) {
  console.log(err);
}


};

const reject = async (id) => {
try {
const reason = prompt(
"Enter rejection reason:"
);


  await API.post("/match/reject", {
    request_id: id,
    reason: reason || "Request rejected"
  });

  loadData();
} catch (err) {
  console.log(err);
}


};

const openChat = (requestId) => {
navigate(`/chat/${requestId}`);
};

if (!adminId) {
return (
<div style={{ padding: "20px", color: "red" }}>
No admin ID found. Please access via admin link. </div>
);
}

if (loading) {
return (
<div style={{ padding: "20px" }}>
Loading dashboard... </div>
);
}

if (error) {
return (
<div
style={{
padding: "20px",
color: "red"
}}
>
{error} </div>
);
}

return (
<div style={{ padding: "20px" }}> <h2>Admin Dashboard</h2>


  {requests.length === 0 && (
    <p>No requests available.</p>
  )}

  {requests.map((r) => (
    <div key={r.id} style={styles.card}>
      <h3>User Information</h3>

      <p>
        <strong>Name:</strong>{" "}
        {r.users?.name}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {r.users?.email}
      </p>

      <hr />

      <h3>Partner Requested</h3>

      <img
        src={r.public_partners?.profile_image}
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

      <hr />

      <p>
        <strong>Status:</strong>{" "}
        {r.status}
      </p>

      <p>
        <strong>User Request:</strong>
      </p>

      <div style={styles.messageBox}>
        {r.user_message ||
          "No request message provided"}
      </div>

      {r.admin_message && (
        <>
          <p>
            <strong>
              Admin Response:
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
          onClick={() => approve(r.id)}
        >
          Approve
        </button>

        <button
          style={styles.rejectBtn}
          onClick={() => reject(r.id)}
        >
          Reject
        </button>

        <button
          style={styles.chatBtn}
          onClick={() => openChat(r.id)}
        >
          Open Chat
        </button>
      </div>
    </div>
  ))}
</div>


);
}

const styles = {
card: {
border: "1px solid #ddd",
borderRadius: "10px",
padding: "15px",
marginBottom: "20px"
},

image: {
width: "150px",
borderRadius: "10px"
},

buttons: {
display: "flex",
gap: "10px",
marginTop: "15px",
flexWrap: "wrap"
},

approveBtn: {
background: "green",
color: "white",
border: "none",
padding: "10px 15px",
cursor: "pointer"
},

rejectBtn: {
background: "red",
color: "white",
border: "none",
padding: "10px 15px",
cursor: "pointer"
},

chatBtn: {
background: "blue",
color: "white",
border: "none",
padding: "10px 15px",
cursor: "pointer"
},

messageBox: {
background: "#f5f5f5",
padding: "10px",
borderRadius: "8px",
marginTop: "5px"
},

adminBox: {
background: "#e8f5e9",
padding: "10px",
borderRadius: "8px",
marginTop: "5px"
}
};
