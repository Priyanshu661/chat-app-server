const Sequelize = require("sequelize");

const sequelize = require("../database/db");

const GroupMember = sequelize.define("GroupMember", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = GroupMember;
