const express = require("express");
const router = express.Router();

const {
  createAdmin,
  getMyUsers
} = require("../controllers/adminController");

// create admin
router.post("/create-admin", createAdmin);

// get admin users
router.get("/my-users/:adminId", getMyUsers);

module.exports = router;