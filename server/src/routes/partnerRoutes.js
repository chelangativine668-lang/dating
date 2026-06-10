const express = require("express");
const router = express.Router();

const {
  createPartner,
  getPartners
} = require("../controllers/partnerController");

const supabase = require("../config/supabase");

/**
 * CREATE PARTNER
 */
router.post("/create", createPartner);

/**
 * GET ALL PARTNERS
 */
router.get("/", getPartners);

/**
 * GET SINGLE PARTNER (FIX ADDED)
 */
router.get("/:id", async (req, res) => {
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
});

module.exports = router;