import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
const { user, logout } = useAuth();

const adminId = localStorage.getItem("adminId");

const isAdmin = user?.role === "admin";

const isUser =
user &&
user.role !== "admin";

const handleLogout = () => {
logout();


localStorage.removeItem("adminId");

window.location.href = "/";


};

return ( <div style={styles.nav}> <h3>Dating App</h3>


  <div style={styles.links}>
    {/* EVERYONE */}
    <Link to="/">
      Home
    </Link>

    {/* USER ONLY */}
    {isUser && (
      <>
        <Link to="/tracking">
          Track Requests
        </Link>
      </>
    )}

    {/* ADMIN ONLY */}
    {isAdmin && (
      <>
        <Link
          to={`/admin/${adminId}`}
        >
          Dashboard
        </Link>

        <Link to="/admin/chat">
          Admin Chats
        </Link>
      </>
    )}

    {/* GUEST ONLY */}
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

    {/* LOGOUT */}
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
