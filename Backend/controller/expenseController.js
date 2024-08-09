const { User, Expense } = require("../models/Relation");

// Create a new User
exports.createExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    const data = {
      amount,
      category,
      description,
    };

    const token = req.headers.authorization.split(" ")[1];
    const decoded = User.verifyToken(token);

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const expense = await user.createExpense({
      amount,
      category,
      description,
    });

    // Update the user's totalExpense
    user.totalExpense += amount;
    await user.save();

    res.json(expense);
    //  await Expense.create(amount, description, category)
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all Expenses for a User

exports.getExpenses = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = User?.verifyToken(token);

    // console.log(decoded);

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const expenses = await user.getExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// delete expense

exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findByPk(expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const user = await User.findByPk(expense.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update the user's totalExpense
    user.totalExpense -= expense.amount;
    await user.save();

    await expense.destroy();
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
