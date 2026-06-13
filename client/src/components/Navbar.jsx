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


// Keep admin route
window.location.href = "/";


};

return ( <nav style={styles.nav}> <div style={styles.logoSection}> <span style={styles.logo}>
❤️ </span>


    <div>
      <h2 style={styles.brand}>
        SoulMatch
      </h2>

      <p style={styles.tagline}>
        Dating Platform
      </p>
    </div>
  </div>

  <div style={styles.links}>
    <Link
      to="/"
      style={styles.link}
    >
      Home
    </Link>

    {isUser && (
      <>
        <Link
          to="/tracking"
          style={styles.link}
        >
           Requests
        </Link>

        <Link
          to="/my-chats"
          style={styles.link}
        >
           Chats
        </Link>
      </>
    )}

    {isAdmin && (
      <>
        <Link
          to={`/admin/${adminId || ""}`}
          style={styles.link}
        >
          Dashboard
        </Link>

        <Link
          to="/admin/chat"
          style={styles.link}
        >
          Admin Chats
        </Link>
      </>
    )}

    {!user && (
      <>
        <Link
          to="/login"
          style={styles.link}
        >
          Login
        </Link>

        <Link
          to="/register"
          style={styles.link}
        >
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
</nav>


);
}

const styles = {
nav: {
background:
"linear-gradient(135deg, #111111, #1a1a1a)",
borderBottom:
"1px solid rgba(255,255,255,0.08)",
padding: "15px 30px",
display: "flex",
justifyContent:
"space-between",
alignItems: "center",
position: "sticky",
top: 0,
zIndex: 1000,
backdropFilter: "blur(10px)",
boxShadow:
"0 8px 20px rgba(0,0,0,0.35)"
},

logoSection: {
display: "flex",
alignItems: "center",
gap: "12px"
},

logo: {
fontSize: "32px"
},

brand: {
margin: 0,
color: "#ffffff",
fontSize: "22px",
fontWeight: "700",
letterSpacing: "0.5px"
},

tagline: {
margin: 0,
color: "#bbbbbb",
fontSize: "12px"
},

links: {
display: "flex",
alignItems: "center",
gap: "14px",
flexWrap: "wrap"
},

link: {
textDecoration: "none",
color: "#f5f5f5",
padding: "10px 16px",
borderRadius: "10px",
fontWeight: "500",
transition: "0.3s",
background:
"rgba(255,255,255,0.03)"
},

logout: {
border: "none",
cursor: "pointer",
background:
"linear-gradient(135deg,#ff4d6d,#ff1f4b)",
color: "#fff",
padding: "10px 18px",
borderRadius: "10px",
fontWeight: "600",
boxShadow:
"0 4px 12px rgba(255,31,75,0.4)"
}
};
