import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function UserChatDashboard() {
const { user } = useAuth();
const navigate = useNavigate();

const [requests, setRequests] = useState([]);
const [unreadCounts, setUnreadCounts] = useState({});
const [loading, setLoading] = useState(true);

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

const unreadRes = await API.get(
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

<div style={{ padding: "20px" }}>
Please login first
</div>
);
}

if (loading) {
return (

<div style={{ padding: "20px" }}>
Loading chats...
</div>
);
}

return (

<div style={{ padding: "20px" }}>
  <h2>My Chats</h2>

{requests.length === 0 ? ( <p>No chats available</p>
) : (
requests.map((request) => (
<div
key={request.id}
style={{
border: "1px solid #ddd",
borderRadius: "10px",
padding: "15px",
marginBottom: "15px"
}}
>
<div
style={{
display: "flex",
justifyContent:
"space-between",
alignItems: "center"
}}
> <h3>
{
request.public_partners
?.name
} </h3>


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
      Status:
      {" "}
      {request.status}
    </p>

    {request.admin_message && (
      <p>
        Admin:
        {" "}
        {request.admin_message}
      </p>
    )}

    <button
      onClick={() =>
        openChat(request.id)
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
