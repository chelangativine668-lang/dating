const supabase = require("../config/supabase");

/**
 * USER - REQUEST SPECIFIC PARTNER (URL-BASED ADMIN SYSTEM)
 */
const requestMatch = async (req, res) => {
  try {
    const { user_id, partner_id, admin_route, admin_id } = req.body;

    // ✅ SUPPORT BOTH OLD + NEW SYSTEMS (FIXED NORMALIZATION ONLY)
    const finalAdminRoute = (admin_route || admin_id || "")
      .toString()
      .trim();

    if (!user_id || !partner_id || !finalAdminRoute) {
      return res.status(400).json({
        message: "user_id, partner_id and admin_route/admin_id are required"
      });
    }

    // 🔐 ENV WHITELIST CHECK (UNCHANGED)
    const allowedAdmins =
      process.env.ALLOWED_ADMINS?.split(",") || [];

    if (allowedAdmins.length > 0) {
      if (!allowedAdmins.includes(finalAdminRoute)) {
        return res.status(403).json({
          message: "Unauthorized admin route"
        });
      }
    }

    // GET USER (UNCHANGED)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // GET ADMIN BY ROUTE (FIXED CASE INSENSITIVE MATCH)
    const { data: admin, error: adminError } = await supabase
      .from("users")
      .select("*")
      .ilike("admin_route", finalAdminRoute)
      .single();

    if (adminError || !admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    // 🔐 ROLE CHECK (UNCHANGED)
    if (admin.role !== "admin") {
      return res.status(403).json({
        message: "User is not an admin"
      });
    }

    // GET PARTNER (UNCHANGED)
    const { data: partner, error: partnerError } = await supabase
      .from("public_partners")
      .select("*")
      .eq("id", partner_id)
      .single();

    if (partnerError || !partner) {
      return res.status(404).json({
        message: "Selected partner not found"
      });
    }

    // CREATE MATCH REQUEST (UNCHANGED)
    const { data, error } = await supabase
      .from("match_requests")
      .insert([
        {
          user_id,
          admin_id: admin.id,
          partner_id,
          status: "pending"
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.json({
      message: `Request sent for ${partner.name}`,
      request: data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/**
 * GET SINGLE REQUEST (UNCHANGED)
 */
const getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    const { data, error } = await supabase
      .from("match_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Request not found"
      });
    }

    res.json({ request: data });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/**
 * ADMIN DASHBOARD (UNCHANGED)
 */
const getAdminDashboardUsers = async (req, res) => {
  try {
    const { admin_id } = req.params;

    const { data, error } = await supabase
      .from("match_requests")
      .select(`
        id,
        status,
        created_at,
        user_id,
        partner_id,
        admin_message,
        partner_contact,
        users:user_id (
          id,
          name,
          email
        ),
        public_partners:partner_id (
          id,
          name,
          gender,
          age,
          country,
          occupation,
          profile_image,
          contact_info
        )
      `)
      .eq("admin_id", admin_id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Dashboard loaded successfully",
      requests: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ADMIN APPROVE (UNCHANGED)
 */
const approveRequest = async (req, res) => {
  try {
    const { request_id, partner_contact, admin_message } = req.body;

    const { data, error } = await supabase
      .from("match_requests")
      .update({
        status: "connected",
        partner_contact: partner_contact || null,
        admin_message: admin_message || "Connection approved"
      })
      .eq("id", request_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "User connected successfully",
      request: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ADMIN REJECT (UNCHANGED)
 */
const rejectRequest = async (req, res) => {
  try {
    const { request_id, reason } = req.body;

    const { data, error } = await supabase
      .from("match_requests")
      .update({
        status: "rejected",
        admin_message: reason || "Request rejected"
      })
      .eq("id", request_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Request rejected",
      request: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * USER DASHBOARD (UNCHANGED)
 */
const getUserDashboard = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("match_requests")
      .select(`
        id,
        status,
        created_at,
        admin_message,
        partner_contact,
        partner_id,
        public_partners:partner_id (
          id,
          name,
          gender,
          age,
          country,
          occupation,
          profile_image,
          bio,
          contact_info
        )
      `)
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "User dashboard loaded",
      requests: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  requestMatch,
  getRequestById,
  getAdminDashboardUsers,
  approveRequest,
  rejectRequest,
  getUserDashboard
};