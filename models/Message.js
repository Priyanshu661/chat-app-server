const Sequelize = require("sequelize");

const sequelize = require("../database/db");

const Message = sequelize.define("Message", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isFile: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = Message;
