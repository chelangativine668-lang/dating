const supabase = require("../config/supabase");

/**
 * USER - REQUEST SPECIFIC PARTNER (URL-BASED ADMIN SYSTEM)
 */
const requestMatch = async (req, res) => {
try {
const {
user_id,
partner_id,
admin_route,
admin_id,
user_message
} = req.body;


const finalAdminRoute = admin_route || admin_id;

if (!user_id || !partner_id || !finalAdminRoute) {
  return res.status(400).json({
    message:
      "user_id, partner_id and admin_route/admin_id are required"
  });
}

const allowedAdmins =
  process.env.ALLOWED_ADMINS?.split(",") || [];

if (allowedAdmins.length > 0) {
  if (!allowedAdmins.includes(finalAdminRoute)) {
    return res.status(403).json({
      message: "Unauthorized admin route"
    });
  }
}

const { data: user, error: userError } =
  await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

if (userError || !user) {
  return res.status(404).json({
    message: "User not found"
  });
}

const { data: admin, error: adminError } =
  await supabase
    .from("users")
    .select("*")
    .eq("admin_route", finalAdminRoute)
    .single();

if (adminError || !admin) {
  return res.status(404).json({
    message: "Admin not found"
  });
}

const { data: partner, error: partnerError } =
  await supabase
    .from("public_partners")
    .select("*")
    .eq("id", partner_id)
    .single();

if (partnerError || !partner) {
  return res.status(404).json({
    message: "Selected partner not found"
  });
}

// Prevent duplicate active requests
const { data: existingRequests } =
  await supabase
    .from("match_requests")
    .select("*")
    .eq("user_id", user_id)
    .eq("partner_id", partner_id)
    .in("status", ["pending", "connected"]);

if (
  existingRequests &&
  existingRequests.length > 0
) {
  return res.status(400).json({
    message:
      "You already have an active request for this partner"
  });
}

const { data, error } = await supabase
  .from("match_requests")
  .insert([
    {
      user_id,
      admin_id: admin.id,
      partner_id,
      status: "pending",
      user_message:
        user_message ||
        "I would like to connect with this partner."
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
 * GET SINGLE REQUEST
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
 * ADMIN DASHBOARD USERS
 */
const getAdminDashboardUsers = async (req, res) => {
try {
const { admin_id } = req.params;

// Find admin by route
const { data: admin, error: adminError } =
  await supabase
    .from("users")
    .select("id")
    .eq("admin_route", admin_id)
    .single();

if (adminError || !admin) {
  return res.status(404).json({
    error: "Admin not found"
  });
}

const { data, error } = await supabase
  .from("match_requests")
  .select(`
    id,
    status,
    created_at,
    user_id,
    partner_id,
    user_message,
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
  .eq("admin_id", admin.id)
  .order("created_at", {
    ascending: false
  });

if (error) {
  return res.status(400).json({
    error: error.message
  });
}

res.json({
  message: "Dashboard loaded successfully",
  requests: data || []
});

} catch (err) {
res.status(500).json({
error: err.message
});
}
};


/**
 * 🔥 NEW FIX: ADMIN CHAT LIST (MISSING ENDPOINT)
 */
const getAdminChats = async (req, res) => {
try {
const { admin_id } = req.params;

// Find admin by route
const { data: admin, error: adminError } =
  await supabase
    .from("users")
    .select("id")
    .eq("admin_route", admin_id)
    .single();

if (adminError || !admin) {
  return res.status(404).json({
    error: "Admin not found"
  });
}

const { data, error } = await supabase
  .from("match_requests")
  .select(`
    id,
    status,
    created_at,
    user_id,
    partner_id,
    admin_id,
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
      profile_image
    )
  `)
  .eq("admin_id", admin.id)
  .order("created_at", {
    ascending: false
  });

if (error) {
  return res.status(400).json({
    error: error.message
  });
}

res.json({
  chats: data || []
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


console.log("USER DASHBOARD USER ID:", user_id);

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

console.log("USER DASHBOARD DATA:", data);
console.log("USER DASHBOARD ERROR:", error);

if (error) {
  return res.status(400).json({
    error: error.message,
    details: error
  });
}

res.json({
  message: "User dashboard loaded",
  requests: data || []
});


} catch (err) {
console.log("SERVER ERROR:", err);


res.status(500).json({
  error: err.message
});


}
};


module.exports = {
  requestMatch,
  getRequestById,
  getAdminDashboardUsers,
  getAdminChats,   // ✅ ADDED
  approveRequest,
  rejectRequest,
  getUserDashboard
};