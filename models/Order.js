const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  //Todo: Razarpay Id
  order_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");

// const Order = sequelize.define("Order", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   order_id: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   status: {
//     type: DataTypes.STRING,
//     default: "pending",
//   },
// });

// module.exports = Order;