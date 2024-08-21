const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    default: "food",
  },
  description: DataTypes.TEXT,
});

module.exports = Expense;
