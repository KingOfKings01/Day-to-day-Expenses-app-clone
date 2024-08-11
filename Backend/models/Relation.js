const User = require("./User")
const Expense = require("./Expense")
const Order = require("./Order")
const ForgotPasswordRequest = require("./ForgotPasswordRequest")

// User hasMany Expenses
User.hasMany(Expense, { foreignKey: "userId" })
Expense.belongsTo(User, { foreignKey: "userId" })

// User hasMany Orders
User.hasMany(Order, { foreignKey: "userId" })
Order.belongsTo(User, { foreignKey: "userId" })

// User hasMany ForgotPasswordRequest
User.hasMany(ForgotPasswordRequest, { foreignKey: "userId" })
ForgotPasswordRequest.belongsTo(User, { foreignKey: "userId"})

module.exports = { User, Expense, Order, ForgotPasswordRequest }