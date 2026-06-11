import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import API from "../api/api";
import PartnerCard from "../components/PartnerCard";

export default function Home() {
  const [partners, setPartners] = useState([]);
  const [searchParams] = useSearchParams();
  const { adminId: routeAdminId } = useParams(); // ✅ NEW SUPPORT

  useEffect(() => {
    // ✅ PRIORITY 1: URL PARAM (/admin/:adminId)
    let adminId = routeAdminId;

    // ✅ PRIORITY 2: QUERY PARAM (?adminId=123)
    if (!adminId) {
      adminId = searchParams.get("adminId");
    }

    // ✅ STORE FOR CHAT SYSTEM
    if (adminId) {
      localStorage.setItem("adminId", adminId);
    }

    loadPartners();
  }, [routeAdminId]);

  const loadPartners = async () => {
    try {
      const res = await API.get("/partners");
      setPartners(res.data.partners);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Available Partners</h1>

      <div style={styles.grid}>
        {partners.map((p) => (
          <PartnerCard key={p.id} partner={p} />
        ))}
      </div>
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