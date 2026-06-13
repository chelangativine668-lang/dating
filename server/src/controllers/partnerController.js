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

/**

* GET SINGLE PARTNER
  */
  const getPartnerById = async (req, res) => {
  try {
  const { id } = req.params;

  const { data, error } = await supabase
  .from("public_partners")
  .select("*")
  .eq("id", id)
  .single();

  if (error || !data) {
  return res.status(404).json({
  message: "Partner not found"
  });
  }

  res.json({
  partner: data
  });

} catch (err) {
res.status(500).json({
error: err.message
});
}
};

module.exports = {
createPartner,
getPartners,
getPartnerById
};
