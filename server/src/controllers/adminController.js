const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");

/**
 * CREATE ADMIN (SUPER ADMIN ONLY)
 */
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if admin exists
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate admin route (URL system)
    const adminRoute =
      name.toLowerCase().replace(/\s/g, "") +
      Math.floor(Math.random() * 1000);

    // insert admin
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          role: "admin",
          admin_route: adminRoute // ✅ USED BY FRONTEND URL SYSTEM
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Admin created successfully",
      admin: data,
      admin_url: `/admin/${adminRoute}` // ✅ IMPORTANT FOR FRONTEND
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ADMIN - GET MY DASHBOARD USERS (FIXED)
 * NOW CONSISTENT WITH match_requests SYSTEM
 */
const getMyUsers = async (req, res) => {
  try {
    const { adminId } = req.params;

    // ❗ FIX: get users through match_requests (NOT assigned_admin_id)
    const { data, error } = await supabase
      .from("match_requests")
      .select(`
        id,
        status,
        created_at,
        user_id,
        partner_id,
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
      .eq("admin_id", adminId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Admin dashboard users fetched successfully",
      requests: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAdmin,
  getMyUsers
};