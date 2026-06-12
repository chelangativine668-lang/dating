import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function AdminChatDashboard() {
const navigate = useNavigate();

const { adminId: routeAdminId } = useParams();

const adminId =
routeAdminId || localStorage.getItem("adminId");

const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
if (adminId) {
loadChats();
}
}, [adminId]);

const loadChats = async () => {
try {
setLoading(true);


  const res = await API.get(
    `/match/dashboard/${adminId}`
  );

  const requests =
    res.data.requests || [];

  const groupedUsers = {};

  requests.forEach((request) => {
    const user = request.users;

    if (!user) return;

    if (!groupedUsers[user.id]) {
      groupedUsers[user.id] = {
        id: user.id,
        name: user.name,
        email: user.email,
        requests: []
      };
    }

    groupedUsers[user.id].requests.push(
      request
    );
  });

  setUsers(
    Object.values(groupedUsers)
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

if (!adminId) {
return (
<div style={{ padding: "20px" }}>
Admin not found </div>
);
}

if (loading) {
return (
<div style={{ padding: "20px" }}>
Loading chats... </div>
);
}

return ( <div style={styles.container}> <h2>Admin Chats</h2>


  {users.length === 0 && (
    <p>No chats available</p>
  )}

  {users.map((user) => (
    <div
      key={user.id}
      style={styles.card}
    >
      <h3>{user.name}</h3>

      <p>{user.email}</p>

      <p>
        Total Requests:
        {" "}
        {user.requests.length}
      </p>

      {user.requests.map((request) => (
        <div
          key={request.id}
          style={styles.requestBox}
        >
          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center"
            }}
          >
            <img
              src={
                request.public_partners
                  ?.profile_image
              }
              alt=""
              style={styles.image}
            />

            <div>
              <h4>
                {
                  request
                    .public_partners
                    ?.name
                }
              </h4>

              <p>
                Status:
                {" "}
                <strong>
                  {request.status}
                </strong>
              </p>

              <p>
                Requested:
                {" "}
                {new Date(
                  request.created_at
                ).toLocaleString()}
              </p>

              {request.user_message && (
                <div
                  style={{
                    background:
                      "#f5f5f5",
                    padding: "10px",
                    borderRadius: "8px",
                    marginTop: "8px"
                  }}
                >
                  <strong>
                    User Message:
                  </strong>

                  <p>
                    {
                      request.user_message
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() =>
              openChat(request.id)
            }
            style={styles.chatBtn}
          >
            Open Chat
          </button>
        </div>
      ))}
    </div>
  ))}
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
marginBottom: "20px"
},

requestBox: {
border: "1px solid #eee",
padding: "15px",
marginTop: "10px",
borderRadius: "8px"
},

image: {
width: "80px",
height: "80px",
borderRadius: "8px",
objectFit: "cover"
},

chatBtn: {
marginTop: "10px",
background: "#0066ff",
color: "#fff",
border: "none",
padding: "10px 15px",
borderRadius: "6px",
cursor: "pointer"
}
};
