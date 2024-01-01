require("dotenv").config();


const express = require("express");
const cors = require("cors");
const http = require("http");


const sequelize = require("./database/db");
const Message = require("./models/Message");
const User = require("./models/User");
const Chat = require("./models/Chat");
const GroupMember = require("./models/GroupMembers");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // console.log(socket.id, "");

  socket.on("send-message",(chat_id)=>{

    socket.emit("receive-message", chat_id);
    // console.log(chat_id, "uuuuuuuuuuuuuudhhhhhwdusudhsdsdsdush");
  })
});



app.use(cors());

app.use(express.json());

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const { Socket } = require("socket.io");

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

Chat.belongsTo(User, {
  foreignKey: "AdminId",
  constraints: true,
  onDelete: "CASCADE",
});

sequelize
  .sync()
  .then((res) => {
   

    console.log("DB Connected!");
  })
  .catch((e) => {
    console.log(e);
  });

 server.listen(process.env.PORT, () => {
     console.log("server is running", process.env.PORT);
   });


