require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./database/db");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);

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
