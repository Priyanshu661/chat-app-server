const User = require("../models/User");

const bcrypt = require("bcrypt");
const sequelize = require("../database/db");

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

module.exports = {
  signup,
};
