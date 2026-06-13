import { Link } from "react-router-dom";

export default function PartnerCard({
partner
}) {
return ( <div style={styles.card}> <div style={styles.imageWrapper}>
<img
src={
partner.profile_image
}
alt={partner.name}
style={styles.image}
/> </div>


  <div
    style={styles.content}
  >
    <h3 style={styles.name}>
      {partner.name}
    </h3>

    <p style={styles.info}>
      {partner.gender} •{" "}
      {partner.age}
    </p>

    <p style={styles.detail}>
      📍 {partner.country}
    </p>

    <p style={styles.detail}>
      💼{" "}
      {partner.occupation}
    </p>

    <Link
      to={`/partner/${partner.id}`}
      style={
        styles.linkWrapper
      }
    >
      <button
        style={styles.button}
      >
        View Profile
      </button>
    </Link>
  </div>
</div>


);
}

const styles = {
card: {
width: "300px",
background: "#181818",
borderRadius: "20px",
overflow: "hidden",
border:
"1px solid rgba(255,255,255,0.08)",
boxShadow:
"0 12px 25px rgba(0,0,0,0.35)",
transition: "0.3s ease",
color: "#fff"
},

imageWrapper: {
width: "100%",
height: "320px",
overflow: "hidden"
},

image: {
width: "100%",
height: "100%",
objectFit: "cover",
display: "block"
},

content: {
padding: "18px"
},

name: {
margin: 0,
fontSize: "24px",
color: "#ffffff"
},

info: {
color: "#ff4d6d",
fontWeight: "600",
marginTop: "8px",
marginBottom: "15px"
},

detail: {
color: "#bdbdbd",
marginBottom: "8px",
fontSize: "14px"
},

linkWrapper: {
textDecoration: "none"
},

button: {
width: "100%",
marginTop: "15px",
padding: "12px",
border: "none",
borderRadius: "12px",
background:
"linear-gradient(135deg,#ff4d6d,#ff1f4b)",
color: "#fff",
fontWeight: "600",
fontSize: "15px",
cursor: "pointer"
}
};
