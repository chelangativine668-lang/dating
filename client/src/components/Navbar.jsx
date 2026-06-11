import { Link } from "react-router-dom";

export default function Navbar() {
  // ✅ GET ADMIN CONTEXT (IMPORTANT FOR YOUR SYSTEM)
  const adminId = localStorage.getItem("adminId");

  return (
    <div style={styles.nav}>
      <h3>Dating App</h3>

      <div style={styles.links}>
        <Link to="/">Home</Link>

        {/* AUTH */}
        <Link to="/login">Login</Link>

        {/* OPTIONAL REGISTER PLACEHOLDER (since you don't have page) */}
        <Link to="/register">Register</Link>

        {/* ✅ FIXED ADMIN ROUTE */}
        {adminId ? (
          <Link to={`/admin/${adminId}`}>Admin</Link>
        ) : (
          <Link to="/admin">Admin</Link>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#222",
    color: "white",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
};