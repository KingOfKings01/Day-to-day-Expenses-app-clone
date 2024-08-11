const express = require("express");
const {
  createExpense,
  getExpenses,
  deleteExpense,
} = require("../controller/expenseController");
const router = express.Router();

router.post("/createExpense", createExpense);
router.get("/getExpenses", getExpenses);
router.delete("/:id", deleteExpense);

module.exports = router;
