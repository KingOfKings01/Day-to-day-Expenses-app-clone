const express = require("express");
const {
  createExpense,
  getExpenses,
  deleteExpense,
  downloadExpenses
} = require("../controller/expenseController");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.post("/createExpense", createExpense);
router.get("/getExpenses", getExpenses);
router.get("/download", verifyToken, downloadExpenses);
router.delete("/:id", deleteExpense);

module.exports = router;