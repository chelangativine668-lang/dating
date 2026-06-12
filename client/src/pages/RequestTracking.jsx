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
return "green";


  case "rejected":
    return "red";

  default:
    return "orange";
}


};

if (!user) {
return (
<div style={{ padding: "20px" }}>
Please login first </div>
);
}

if (loading) {
return (
<div style={{ padding: "20px" }}>
Loading requests... </div>
);
}

return ( <div style={styles.container}> <h2>My Request Tracking</h2>


  {requests.length === 0 ? (
    <p>No requests found</p>
  ) : (
    requests.map((request) => (
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

        <h3>
          {
            request.public_partners
              ?.name
          }
        </h3>

        <p>
          Status:
          {" "}
          <strong
            style={{
              color:
                getStatusColor(
                  request.status
                )
            }}
          >
            {request.status}
          </strong>
        </p>

        {request.status ===
          "pending" && (
          <p
            style={{
              color: "orange"
            }}
          >
            Waiting for admin review.
          </p>
        )}

        {request.admin_message && (
          <p>
            <strong>
              Admin Message:
            </strong>
            {" "}
            {
              request.admin_message
            }
          </p>
        )}

        {request.partner_contact && (
          <div
            style={{
              background:
                "#e8ffe8",
              padding: "10px",
              borderRadius:
                "8px",
              marginTop: "10px"
            }}
          >
            <strong>
              Partner Contact:
            </strong>

            <br />

            {
              request.partner_contact
            }
          </div>
        )}

        <p>
          Requested:
          {" "}
          {new Date(
            request.created_at
          ).toLocaleString()}
        </p>

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
    ))
  )}
</div>


);
}

const styles = {
container: {
padding: "20px"
},

card: {
border: "1px solid #ddd",
borderRadius: "10px",
padding: "15px",
marginBottom: "15px"
},

image: {
width: "120px",
height: "120px",
objectFit: "cover",
borderRadius: "10px"
},

chatButton: {
marginTop: "10px",
padding: "10px 15px",
background: "#007bff",
color: "white",
border: "none",
borderRadius: "5px",
cursor: "pointer"
}
};
