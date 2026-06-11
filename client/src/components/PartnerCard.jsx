import { Link } from "react-router-dom";

export default function PartnerCard({ partner }) {
  // ✅ GET ADMIN FROM LOCAL STORAGE
  const adminId = localStorage.getItem("adminId");

  return (
    <div style={styles.card}>
      <img
        src={partner.profile_image}
        alt={partner.name}
        style={styles.image}
      />

      <h3>{partner.name}</h3>
      <p>{partner.gender} • {partner.age}</p>
      <p>{partner.country}</p>
      <p>{partner.occupation}</p>

      {/* ✅ CLEAN ADMIN ROUTE SYSTEM */}
      <Link to={`/partner/${partner.id}`}>
        <button style={styles.button}>
          View Profile
        </button>
      </Link>
    </div>
  );
}

const styles = {
  card: {
    width: "250px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    margin: "10px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px"
  },
  button: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    cursor: "pointer"
  }
};