const supabase = require("../config/supabase");

/**
 * CREATE PARTNER
 */
const createPartner = async (req, res) => {
  try {
    const {
      name,
      gender,
      age,
      country,
      occupation,
      bio,
      profile_image,
      contact_info
    } = req.body;

    const { data, error } = await supabase
      .from("public_partners")
      .insert([
        {
          name,
          gender,
          age,
          country,
          occupation,
          bio,
          profile_image,
          contact_info
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
      message: "Partner created successfully",
      partner: data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/**
 * GET ALL PARTNERS
 */
const getPartners = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("public_partners")
      .select("*")
      .eq("is_active", true);

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.json({
      partners: data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  createPartner,
  getPartners
};