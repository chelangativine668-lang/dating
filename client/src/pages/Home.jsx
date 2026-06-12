import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import PartnerCard from "../components/PartnerCard";

export default function Home() {
const [partners, setPartners] = useState([]);
const [loading, setLoading] = useState(true);

const { adminId: routeAdminId } = useParams();

useEffect(() => {
validateAdmin();
}, [routeAdminId]);

const validateAdmin = () => {
const allowedAdmins =
import.meta.env.VITE_ALLOWED_ADMINS?.split(",") || [];

let adminId = routeAdminId;

if (!adminId) {
  adminId = localStorage.getItem("adminId");
}

if (adminId && allowedAdmins.length > 0) {
  if (allowedAdmins.includes(adminId)) {
    localStorage.setItem("adminId", adminId);
  } else {
    console.log("❌ Invalid adminId blocked:", adminId);
    localStorage.removeItem("adminId");
    return;
  }
} else if (adminId) {
  localStorage.setItem("adminId", adminId);
}

loadPartners();


};

const loadPartners = async () => {
try {
setLoading(true);


  const res = await API.get("/partners");

  setPartners(res.data.partners || []);
} catch (err) {
  console.log(err);
} finally {
  setLoading(false);
}


};

if (loading) {
return ( <div style={styles.container}> <h2>Loading partners...</h2> </div>
);
}

return ( <div style={styles.container}> <h1>Available Partners</h1>


  {partners.length === 0 ? (
    <p>No partners available.</p>
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
container: {
padding: "20px",
textAlign: "center"
},
grid: {
display: "flex",
flexWrap: "wrap",
justifyContent: "center"
}
};
