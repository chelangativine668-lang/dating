const express = require("express");
const router = express.Router();

const {
createPartner,
getPartners,
getPartnerById
} = require("../controllers/partnerController");

/**

* CREATE PARTNER
  */
  router.post("/create", createPartner);

/**

* GET ALL PARTNERS
  */
  router.get("/", getPartners);

/**

* GET SINGLE PARTNER
  */
  router.get("/:id", getPartnerById);

module.exports = router;
