const Sequelize = require("sequelize");

const sequelize = require("../database/db");

const Chat = sequelize.define("Chat", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  chat_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  isGroupChat: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = Chat;
