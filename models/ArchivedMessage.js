const Sequelize = require("sequelize");

const sequelize = require("../database/db");

const ArchivedMessage = sequelize.define("ArchivedMessage", {
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

  UserId: {
    type: Sequelize.BIGINT,
  },
  ChatId: {
    type: Sequelize.BIGINT,
  },
});

module.exports = ArchivedMessage;
