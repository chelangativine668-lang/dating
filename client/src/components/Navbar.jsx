import { Link } from "react-router-dom";

export default function Navbar() {
const adminId =
localStorage.getItem("adminId");

return ( <div style={styles.nav}> <h3>Dating App</h3>


  <div style={styles.links}>
    {/* HOME */}
    <Link to="/">
      Home
    </Link>

    {/* USER AUTH */}
    <Link to="/login">
      Login
    </Link>

    <Link to="/register">
      Register
    </Link>

    {/* USER FEATURES */}
    <Link to="/tracking">
      Track Requests
    </Link>

    {/* ADMIN DASHBOARD */}
    {adminId ? (
      <>
        <Link to={`/admin/${adminId}`}>
          Dashboard
        </Link>

        <Link to="/admin/chat">
          Admin Chats
        </Link>
      </>
    ) : (
      <Link to="/admin">
        Admin
      </Link>
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
color: "white",
},

links: {
display: "flex",
gap: "15px",
alignItems: "center",
},
};
