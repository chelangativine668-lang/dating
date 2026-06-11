import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function PartnerProfile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { user } = useAuth();

  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ SUPPORT BOTH SYSTEMS (URL + LOCALSTORAGE)
  const adminRoute =
    searchParams.get("adminId") || localStorage.getItem("adminId") || "";

  useEffect(() => {
    fetchPartner();
  }, [id]);

  const fetchPartner = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/partners/${id}`);
      setPartner(res.data.partner);

    } catch (err) {
      console.error("Failed to load partner:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * CREATE MATCH REQUEST + START CHAT
   */
  const startChat = async () => {
    try {
      if (!user?.id) {
        alert("Please login first");
        return;
      }

      // ❗ HARD GUARD (IMPORTANT FOR PRODUCTION)
      if (!adminRoute || adminRoute.trim() === "") {
        alert("Admin route missing. Please open correct admin link.");
        return;
      }

      const res = await API.post("/match/request", {
        user_id: user.id,
        partner_id: id,
        admin_route: adminRoute,
      });

      const requestId = res.data?.request?.id;

      if (!requestId) {
        alert("Failed to create chat request");
        return;
      }

      navigate(`/chat/${requestId}`);

    } catch (err) {
      console.error("Chat start error:", err);
      alert(
        err.response?.data?.message ||
        "Failed to start chat"
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!partner) return <p>Partner not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{partner.name}</h2>

      <img
        src={partner.profile_image}
        alt="profile"
        style={{
          width: "200px",
          borderRadius: "10px"
        }}
      />

      <p>{partner.bio}</p>
      <p>
        {partner.age} | {partner.gender} | {partner.country}
      </p>

      <p>{partner.occupation}</p>

      {/* CHAT BUTTON */}
      <button
        onClick={startChat}
        style={{
          marginTop: "15px",
          padding: "12px",
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px"
        }}
      >
        💬 Chat with Admin
      </button>
    </div>
  );
}