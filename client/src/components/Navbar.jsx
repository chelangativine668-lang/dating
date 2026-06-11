import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={styles.nav}>
      <h3>Dating App</h3>

      <div style={styles.links}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/admin">Admin</Link>
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