const express = require("express");
const {
  loginUser,
  createUser,
  buyPremium,
  protectedRoute,
  updateOrder,
  getUsersWithTotalExpenses,
  getDownloadHistory,
} = require("../controller/userController");

const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/login", loginUser);
router.post("/sing-in", createUser);
router.post("/update-order", updateOrder); //! Protect

// Use the verifyToken middleware for protected routes
router.get("/leader-board", verifyToken, getUsersWithTotalExpenses);
router.post("/buy-premium", verifyToken, buyPremium);
router.post("/protected-route", verifyToken, protectedRoute);
router.get("/download-history", verifyToken, getDownloadHistory);

module.exports = router;
