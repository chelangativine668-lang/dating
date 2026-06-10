const supabase = require("../config/supabase");

/**
 * USER - REQUEST SPECIFIC PARTNER (URL-BASED ADMIN SYSTEM)
 */
const requestMatch = async (req, res) => {
  try {
    const { user_id, partner_id, admin_route } = req.body;

    if (!user_id || !partner_id || !admin_route) {
      return res.status(400).json({
        message: "user_id, partner_id and admin_route are required"
      });
    }

    // GET USER
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

    // GET ADMIN BY ROUTE (IMPORTANT CHANGE)
    const { data: admin, error: adminError } = await supabase
      .from("users")
      .select("*")
      .eq("admin_route", admin_route)
      .single();

    if (adminError || !admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    // GET PARTNER
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

    // CREATE MATCH REQUEST
    const { data, error } = await supabase
      .from("match_requests")
      .insert([
        {
          user_id,
          admin_id: admin.id, // 👈 LINKED TO URL ADMIN
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
 * GET SINGLE REQUEST (CHAT SYSTEM)
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

    res.json({
      request: data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/**
 * ADMIN DASHBOARD
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
      return res.status(400).json({
        error: error.message
      });
    }

    res.json({
      message: "Dashboard loaded successfully",
      requests: data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/**
 * ADMIN APPROVE
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
      return res.status(400).json({
        error: error.message
      });
    }

    res.json({
      message: "User connected successfully",
      request: data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/**
 * ADMIN REJECT
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
      return res.status(400).json({
        error: error.message
      });
    }

    res.json({
      message: "Request rejected",
      request: data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/**
 * USER DASHBOARD
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
      return res.status(400).json({
        error: error.message
      });
    }

    res.json({
      message: "User dashboard loaded",
      requests: data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
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