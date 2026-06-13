import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

export default function AdminChatDashboard() {
const navigate = useNavigate();
const { user } = useAuth();

const { adminId: routeAdminId } = useParams();

const adminId =
routeAdminId || localStorage.getItem("adminId");

const [users, setUsers] = useState([]);
const [unreadCounts, setUnreadCounts] = useState({});
const [loading, setLoading] = useState(false);

useEffect(() => {
if (adminId) {
loadChats();
}
}, [adminId, user]);

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
    const userData = request.users;

    if (!userData) return;

    if (!groupedUsers[userData.id]) {
      groupedUsers[userData.id] = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        requests: []
      };
    }

    groupedUsers[userData.id].requests.push(
      request
    );
  });

  setUsers(
    Object.values(groupedUsers)
  );

  // FIX: use admin UUID, not admin route
  if (user?.id) {
    const unreadRes = await API.get(
      `/chat/unread/${user.id}`
    );

    setUnreadCounts(
      unreadRes.data.counts || {}
    );
  }

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

  {users.map((userData) => (
    <div
      key={userData.id}
      style={styles.card}
    >
      <h3>{userData.name}</h3>

      <p>{userData.email}</p>

      <p>
        Total Requests:{" "}
        {userData.requests.length}
      </p>

      {userData.requests.map((request) => (
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <h4>
                  {
                    request
                      .public_partners
                      ?.name
                  }
                </h4>

                {unreadCounts[
                  request.id
                ] > 0 && (
                  <span
                    style={{
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      minWidth: "25px",
                      height: "25px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  >
                    {
                      unreadCounts[
                        request.id
                      ]
                    }
                  </span>
                )}
              </div>

              <p>
                Status:{" "}
                <strong>
                  {request.status}
                </strong>
              </p>

              <p>
                Requested:{" "}
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
