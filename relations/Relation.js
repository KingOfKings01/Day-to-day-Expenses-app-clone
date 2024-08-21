const User = require("../models/User")
const Expense = require("../models/Expense")
const Order = require("../models/Order")
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest")
const Downloaded = require("../models/Downloaded")

// User hasMany Expenses
User.hasMany(Expense, { foreignKey: "userId" })
Expense.belongsTo(User, { foreignKey: "userId" })

// User hasMany Orders
User.hasMany(Order, { foreignKey: "userId" })
Order.belongsTo(User, { foreignKey: "userId" })

// User hasMany Forgot Password Requests
User.hasMany(ForgotPasswordRequest, { foreignKey: "userId" })
ForgotPasswordRequest.belongsTo(User, { foreignKey: "userId"})

// User hasMany Downloaded Reports
User.hasMany(Downloaded, { foreignKey: "userId"})
Downloaded.belongsTo(User, { foreignKey: "userId"})

module.exports = { User, Expense, Order, ForgotPasswordRequest, Downloaded}