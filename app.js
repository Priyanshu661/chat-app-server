require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./database/db");
const Message = require("./models/Message");
const User = require("./models/User");
const Chat = require("./models/Chat");
const GroupMember=require("./models/GroupMembers")

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

User.hasMany(Message);

Message.belongsTo(User);
Chat.hasMany(Message);
// User.hasMany(Chat);
// Chat.hasMany(User);
Message.belongsTo(Chat);
User.belongsToMany(Chat, { through: GroupMember });
Chat.belongsToMany(User, { through: GroupMember });

sequelize
  .sync()
  .then((res) => {
    app.listen(process.env.PORT, () => {
      console.log("server is running", process.env.PORT);
    });

    console.log("DB Connected!");
  })
  .catch((e) => {
    console.log(e);
  });
