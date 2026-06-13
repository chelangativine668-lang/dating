import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
const { user, logout } = useAuth();

const adminId =
localStorage.getItem("adminId");

const isAdmin =
user?.role === "admin";

const isUser =
user?.role === "user";

const handleLogout = () => {
logout();


// IMPORTANT:
// Do NOT remove adminId.
// It identifies the active admin route
// and is required for users to continue
// chatting with the correct admin
// after logging back in.

window.location.href = "/";


};

return ( <div style={styles.nav}> <h3>Dating App</h3>


  <div style={styles.links}>
    <Link to="/">
      Home
    </Link>

    {isUser && (
      <>
        <Link to="/tracking">
          Track Requests
        </Link>

        <Link to="/my-chats">
          My Chats
        </Link>
      </>
    )}

    {isAdmin && (
      <>
        <Link
          to={`/admin/${adminId || ""}`}
        >
          Dashboard
        </Link>

        <Link to="/admin/chat">
          Admin Chats
        </Link>
      </>
    )}

    {!user && (
      <>
        <Link to="/login">
          Login
        </Link>

        <Link to="/register">
          Register
        </Link>
      </>
    )}

    {user && (
      <button
        onClick={handleLogout}
        style={styles.logout}
      >
        Logout
      </button>
    )}
  </div>
</div>

);
}

const styles = {
nav: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
padding: "12px 20px",
background: "#222",
color: "white"
},

links: {
display: "flex",
gap: "15px",
alignItems: "center"
},

logout: {
background: "#dc3545",
color: "white",
border: "none",
padding: "8px 12px",
borderRadius: "5px",
cursor: "pointer"
}
};
