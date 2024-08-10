const User = require("./User")
const Expense = require("./Expense")
const Order = require("./Order")

// User hasMany Expenses

User.hasMany(Expense, { foreignKey: "userId" })
Expense.belongsTo(User, { foreignKey: "userId" })

// User hasMany Order
User.hasMany(Order, { foreignKey: "userId" })
Order.belongsTo(User, { foreignKey: "userId" })


//Todo: Whenever an Expense is created, updated, or deleted, totalExpense is updated.
//! This code is not working as expected. The parameters are missing.
Expense.beforeCreate(async (expense) => {
    const user = await User.findByPk(expense.UserId);
    console.log("Expense: ",expense);
    if (user) {
      user.totalExpense += expense.amount;
      await user.save();
    }
  });
  
  Expense.beforeUpdate(async (expense) => {
    const originalExpense = await Expense.findByPk(expense.id);
    const user = await User.findByPk(expense.UserId);
    if (user) {
      user.totalExpense += (expense.amount - originalExpense.amount);
      await user.save();
    }
  });
  
  Expense.beforeDestroy(async (expense) => {
    const user = await User.findByPk(expense.UserId);
    if (user) {
      user.totalExpense -= expense.amount;
      await user.save();
    }
  });
  

module.exports = { User, Expense, Order }