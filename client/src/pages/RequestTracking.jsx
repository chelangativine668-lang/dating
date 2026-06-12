import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function RequestTracking() {
const { user } = useAuth();

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
          <strong>
            {request.status}
          </strong>
        </p>

        {request.admin_message && (
          <p>
            Admin Message:
            {" "}
            {request.admin_message}
          </p>
        )}

        {request.partner_contact && (
          <p>
            Contact:
            {" "}
            {request.partner_contact}
          </p>
        )}

        <p>
          Requested:
          {" "}
          {new Date(
            request.created_at
          ).toLocaleString()}
        </p>
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
}
};
