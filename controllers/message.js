const sequelize = require("../database/db");
const Message = require("../models/Message");
const User = require("../models/User");

const send_message = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { message } = req.body;

    // if (!message) {
    //   return res.json({
    //     success: false,
    //     error: "Please provide all the details.",
    //   });
    // }
    await Message.create(
      {
        message: message,
        UserId: req.user.id,
      },
      {
        transaction: t,
      }
    );
    await t.commit();
    return res.status(200).json({ success: true, message: "Message Sent!" });
  } catch (e) {
    await t.rollback();
    return res.status(400).json({ success: false, error: "Server Error" });
  }
};

const fetch_messages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        UserId: req.user.id,
      },
      attributes:["message"]
      
    });

    const data=messages.map((item)=>{
      return {
            name:req.user.name,
            message:item.message
      }
    })


    return res.status(200).json({ success: true,data});
  } catch (e) {
    return res.status(400).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  send_message,
  fetch_messages
};
