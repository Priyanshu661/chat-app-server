const User = require("../models/User");

const bcrypt = require("bcrypt");
const sequelize = require("../database/db");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.json({
        success: false,
        error: "Please fill all the details.",
      });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
      transaction: t,
    });

    if (user) {
      return res.json({
        success: false,
        error: "Account with this email already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create(
      {
        name,
        email,
        phone,
        password: hashedPassword,
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    return res.status(200).json({ success: true, message: "Account Created!" });
  } catch (e) {
    await t.rollback();
    return res.status(400).json({ success: false, error: e });
  }
};

const login = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        error: "Please provide all the details.",
      });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
      transaction: t,
    });

    if (!user) {
      return res.json({
        success: false,
        error: "Account Not Found!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({
        success: false,
        error: "Invalid Email or Password!",
      });
    }

    const token = await jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    await t.commit();
    return res
      .status(200)
      .json({ success: true, token, message: "Login Successfull!" });
  } catch (e) {
    await t.rollback();
    return res.status(400).json({ success: false, error: e });
  }
};
module.exports = {
  signup,
  login
};
