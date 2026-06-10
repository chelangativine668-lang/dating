const express = require("express");
const router = express.Router();

const {
  requestMatch,
  getAdminDashboardUsers,
  approveRequest,
  rejectRequest,
  getUserDashboard,
  getRequestById
} = require("../controllers/matchController");

// USER REQUEST
router.post("/request", requestMatch);

// ADMIN DASHBOARD (existing)
router.get("/dashboard/:admin_id", getAdminDashboardUsers);

// ADMIN APPROVE / REJECT
router.post("/approve", approveRequest);
router.post("/reject", rejectRequest);

// USER DASHBOARD
router.get("/user/dashboard/:user_id", getUserDashboard);

// GET SINGLE REQUEST (CHAT NEEDS THIS)
router.get("/request/:requestId", getRequestById);

// 🆕 ADMIN CHAT DASHBOARD (NEW)
router.get("/admin/:admin_id/chats", async (req, res) => {
  const supabase = require("../config/supabase");

  try {
    const { admin_id } = req.params;

    const { data, error } = await supabase
      .from("match_requests")
      .select(`
        id,
        user_id,
        partner_id,
        status,
        created_at,
        users:user_id (id, name, email),
        public_partners:partner_id (id, name, profile_image)
      `)
      .eq("admin_id", admin_id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ chats: data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;