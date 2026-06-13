const express = require("express");
const router = express.Router();

const {
  requestMatch,
  getAdminDashboardUsers,
  getAdminChats,
  approveRequest,
  rejectRequest,
  getUserDashboard,
  getRequestById
} = require("../controllers/matchController");

/*
|--------------------------------------------------------------------------
| USER REQUEST
|--------------------------------------------------------------------------
*/
router.post("/request", requestMatch);

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/
router.get(
  "/dashboard/:admin_id",
  getAdminDashboardUsers
);

/*
|--------------------------------------------------------------------------
| ADMIN CHAT DASHBOARD
|--------------------------------------------------------------------------
*/
router.get(
  "/admin/:admin_id/chats",
  getAdminChats
);

/*
|--------------------------------------------------------------------------
| ADMIN ACTIONS
|--------------------------------------------------------------------------
*/
router.post("/approve", approveRequest);

router.post("/reject", rejectRequest);

/*
|--------------------------------------------------------------------------
| USER TRACKING PAGE
|--------------------------------------------------------------------------
*/
router.get(
  "/user-dashboard/:user_id",
  getUserDashboard
);

/*
|--------------------------------------------------------------------------
| SINGLE REQUEST
|--------------------------------------------------------------------------
*/
router.get(
  "/request/:requestId",
  getRequestById
);

module.exports = router;