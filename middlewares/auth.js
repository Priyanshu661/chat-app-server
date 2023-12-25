const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res,next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.json({ error: "No token found!" });
    }

    const checkToken = await jwt.verify(token, process.env.JWT_SECRET);

    if (!checkToken) {
      return res.json({
        error: "Invalid Token or Token Expired!",
      });
    }
    const userId = checkToken.userId;

    const user = await User.findByPk(userId);



    if (!user) {
      return res.json({
        error: "No User Found",
      });
    }

    req.user = user;

    next();
  } catch (e) {
    return res.status(400).json({ error:"server error" });
  }
};

module.exports = {
  authenticate,
};
