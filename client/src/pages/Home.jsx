import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";
import PartnerCard from "../components/PartnerCard";

export default function Home() {
  const [partners, setPartners] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // ✅ GET ALLOWED ADMINS FROM ENV
    const allowedAdmins =
      import.meta.env.VITE_ALLOWED_ADMINS?.split(",") || [];

    // ✅ PRIORITY 1: QUERY PARAM (?adminId=123)
    let adminId = searchParams.get("adminId");

    // ✅ PRIORITY 2: FALLBACK LOCALSTORAGE
    if (!adminId) {
      adminId = localStorage.getItem("adminId");
    }

    // 🔐 VALIDATE ADMIN AGAINST WHITELIST
    if (adminId && allowedAdmins.length > 0) {
      if (allowedAdmins.includes(adminId)) {
        localStorage.setItem("adminId", adminId);
      } else {
        console.log("❌ Invalid adminId blocked:", adminId);
        localStorage.removeItem("adminId");
        adminId = null;
      }
    } else if (adminId) {
      // fallback if env not set
      localStorage.setItem("adminId", adminId);
    }

    loadPartners();
  }, [searchParams]);

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