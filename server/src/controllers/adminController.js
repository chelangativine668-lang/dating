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

    // generate admin route
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
          admin_route: adminRoute
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Admin created successfully",
      admin: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ADMIN - GET MY USERS
 */
const getMyUsers = async (req, res) => {
  try {
    const { adminId } = req.params;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("assigned_admin_id", adminId)
      .eq("role", "user");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Admin users fetched successfully",
      users: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAdmin,
  getMyUsers
};