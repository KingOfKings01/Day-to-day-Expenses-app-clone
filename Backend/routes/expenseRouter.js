const express = require("express");
const {
  createExpense,
  getExpenses,
  deleteExpense,
  downloadExpenses,
} = require("../controller/expenseController");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.post("/createExpense", verifyToken, createExpense);
router.get("/getExpenses", verifyToken, getExpenses);
router.get("/download", verifyToken, downloadExpenses);
router.delete("/:id", verifyToken, deleteExpense);

module.exports = router;