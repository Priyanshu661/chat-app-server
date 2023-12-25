const Sequelize=require("sequelize")

const sequelize=require("../database/db")

const User = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports=User

