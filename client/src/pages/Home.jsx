import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import PartnerCard from "../components/PartnerCard";

export default function Home() {
const [partners, setPartners] =
useState([]);

const [loading, setLoading] =
useState(true);

const { user } = useAuth();

const {
adminId: routeAdminId
} = useParams();

useEffect(() => {
validateAdmin();
}, [routeAdminId]);

const validateAdmin = () => {
const allowedAdmins =
import.meta.env
.VITE_ALLOWED_ADMINS
?.split(",") || [];


let adminId = routeAdminId;

if (!adminId) {
  adminId =
    localStorage.getItem(
      "adminId"
    );
}

if (
  adminId &&
  allowedAdmins.length > 0
) {
  if (
    allowedAdmins.includes(
      adminId
    )
  ) {
    localStorage.setItem(
      "adminId",
      adminId
    );
  } else {
    console.log(
      "❌ Invalid adminId blocked:",
      adminId
    );

    localStorage.removeItem(
      "adminId"
    );

    return;
  }
} else if (adminId) {
  localStorage.setItem(
    "adminId",
    adminId
  );
}

loadPartners();


};

const loadPartners =
async () => {
try {
setLoading(true);


    const res =
      await API.get(
        "/partners"
      );

    setPartners(
      res.data.partners ||
        []
    );
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};


if (loading) {
return (
<div
style={
styles.loadingContainer
}
> <div
       style={styles.spinner}
     /> <h2>
Loading partners... </h2> </div>
);
}

return ( <div style={styles.page}> <div style={styles.hero}> <h1
       style={styles.heroTitle}
     >
❤️ SoulMatch </h1>


    <p
      style={
        styles.heroSubtitle
      }
    >
      Find meaningful
      connections with
      people who share
      your interests and
      values.
    </p>
  </div>

  <div
    style={
      styles.sectionHeader
    }
  >
    <h2>
      Available Partners
    </h2>

    <p>
      Browse profiles and
      connect through your
      trusted SoulMatch
      admin.
    </p>
  </div>

  {partners.length === 0 ? (
    <div
      style={
        styles.emptyState
      }
    >
      <h3>
        No partners
        available
      </h3>

      <p>
        Check again later.
      </p>
    </div>
  ) : (
    <div style={styles.grid}>
      {partners.map((p) => (
        <PartnerCard
          key={p.id}
          partner={p}
        />
      ))}
    </div>
  )}
</div>


);
}

const styles = {
page: {
minHeight: "100vh",
background:
"linear-gradient(135deg,#0d0d0d,#1b1b1b)",
color: "#fff",
padding: "30px"
},

hero: {
textAlign: "center",
padding:
"40px 20px 60px"
},

heroTitle: {
fontSize: "48px",
marginBottom: "15px",
color: "#ff4d6d"
},

heroSubtitle: {
color: "#bbb",
maxWidth: "700px",
margin: "0 auto",
fontSize: "18px",
lineHeight: "1.7"
},

sectionHeader: {
textAlign: "center",
marginBottom: "30px"
},

grid: {
display: "flex",
flexWrap: "wrap",
justifyContent:
"center",
gap: "25px"
},

loadingContainer: {
minHeight: "100vh",
background:
"linear-gradient(135deg,#0d0d0d,#1b1b1b)",
color: "#fff",
display: "flex",
flexDirection:
"column",
justifyContent:
"center",
alignItems: "center"
},

spinner: {
width: "45px",
height: "45px",
border:
"4px solid rgba(255,255,255,0.2)",
borderTop:
"4px solid #ff4d6d",
borderRadius: "50%",
marginBottom: "20px"
},

emptyState: {
textAlign: "center",
padding: "50px",
background:
"rgba(255,255,255,0.04)",
borderRadius: "20px"
}
};
