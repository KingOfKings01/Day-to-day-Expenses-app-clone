const User = require("./User")
const Expense = require("./Expense")

// User hasMany Expenses

User.hasMany(Expense, { foreignKey: "userId" })
Expense.belongsTo(User, { foreignKey: "userId" })

module.exports = { User, Expense }