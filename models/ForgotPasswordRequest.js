const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgotPasswordRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  }
})

const ForgotPasswordRequest = mongoose.model("ForgotPasswordRequest", forgotPasswordRequestSchema);
module.exports = ForgotPasswordRequest
// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");

// const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
//   id: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     primaryKey: true,
//   },
//   isActive: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//   }
// });

// module.exports = ForgotPasswordRequest;