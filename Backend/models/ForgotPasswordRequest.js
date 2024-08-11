const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
});

module.exports = ForgotPasswordRequest;