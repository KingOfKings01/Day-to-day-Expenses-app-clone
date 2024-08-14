const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Downloaded = sequelize.define("Downloaded", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Downloaded;