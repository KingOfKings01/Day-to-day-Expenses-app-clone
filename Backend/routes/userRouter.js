const express = require("express");
const {
  verifyToken,
  loginUser,
  createUser,
  buyPremium,
  protectedRoute,
  updateOrder,
  getUsersWithTotalExpenses,
} = require("../controller/userController");
const router = express.Router();

router.post("/login", loginUser);
router.post("/sing-in", createUser);
router.post("/update-order", updateOrder);

router.get("/leader-board", getUsersWithTotalExpenses);

// Use the verifyToken middleware for protected routes
router.post("/buy-premium", verifyToken, buyPremium);
router.post("/protected-route", verifyToken, protectedRoute);

module.exports = router;