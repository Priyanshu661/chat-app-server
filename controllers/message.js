const { Sequelize } = require("sequelize");
const sequelize = require("../database/db");
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");
const upload_to_s3 = require("../services/aws_sdk");

const send_message = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { message, chatId } = req.body;

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
        ChatId: chatId,
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

const send__file_message = async (req, res) => {
  const t = await sequelize.transaction();
  try {


    const { message, chatId } = req.body;

   

  

    // console.log(message.get("file"))

    await Message.create(
      {
        message: message,
        UserId: req.user.id,
        ChatId: chatId,
        isFile: true,
      },
      {
        transaction: t,
      }
    );
    await t.commit();
    return res.status(200).json({ success: true, message: "Message Sent!" });
  } catch (e) {
    console.log(e);
    await t.rollback();
    return res.status(400).json({ success: false, error: "Server Error" });
  }
};

const fetch_messages = async (req, res) => {
  try {
    const id = req.query.lastMsgId ? req.query.lastMsgId : -1;
    const messages = await Message.findAll({
      where: {
        UserId: req.user.id,
        id: {
          [Sequelize.Op.gt]: id,
        },
      },
      attributes: ["message", "id"],
    });

    const data = messages.map((item) => {
      return {
        name: req.user.name,
        message: item.message,
        id: item.id,
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (e) {
    return res.status(400).json({ success: false, error: "Server Error" });
  }
};

const fetch_users = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: req.user.id,
        },
      },
      attributes: ["name", "id"],
    });

    return res.status(200).json({ success: true, data: users });
  } catch (e) {
    return res.status(400).json({ success: false, error: "Server Error" });
  }
};

const create_group = async (req, res) => {
  try {
    const { selectedUsers, groupName } = req.body;

    const group = await req.user.createChat({
      chat_name: groupName,
      AdminId: req.user.id,
    });

    selectedUsers?.map(async (id) => {
      await group.addUser(id);
    });

    return res.status(200).json({ success: true, message: "Group Created" });
  } catch (e) {
    return res.status(400).json({ success: false, error: "Server Error" });
  }
};

const fetch_all_groups = async (req, res) => {
  try {
    const groups = await req.user.getChats();

    return res.status(200).json({ success: true, data: groups });
  } catch (e) {
    return res.status(400).json({ success: false, error: "Server Error" });
  }
};

const fetch_groups_details = async (req, res) => {
  try {
    const chat_id = req.params.id;
    const group = await Chat.findOne({
      where: {
        id: chat_id,
      },
    });

    const members = await group.getUsers();

    const memberData = [];
    members.forEach((member) => {
      if (member.id !== req.user.id) {
        memberData.push(member.id);
      }
    });

    const data = {
      memberData,
      groupName: group.chat_name,
    };

    return res.status(200).json({ success: true, data });
  } catch (e) {
    return res.status(400).json({ success: false, error: "Server Error" });
  }
};

const update_groups_details = async (req, res) => {
  try {
    const chat_id = req.params.id;
    const { selectedUsers, groupName } = req.body;
    const group = await Chat.findOne({
      where: {
        id: chat_id,
      },
    });

    const updatedGroup = await group.update({
      AdminId: req.user.id,
      chat_name: groupName,
    });

    selectedUsers.push(req.user.id);
    await group.setUsers(null);

    selectedUsers?.map(async (id) => {
      await group.addUser(id);
    });

    return res.status(200).json({ success: true, message: "Group is updated" });
  } catch (e) {
    return res.status(400).json({ success: false, error: "Server Error" });
  }
};

const fetch_chat_messages = async (req, res) => {
  try {
    const chat_id = req.query.chat_id;
    // const messages = await Message.findAll({
    //   where: {
    //     ChatId: chat_id,
    //   },
    //   attributes: ["message", "id"],

    // });

    // const group=await Chat.findOne({
    //   where:{
    //     id:chat_id
    //   }
    // })

    // const members=await group.getUsers()

    // console.log(members)
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          attibutes: ["id", "name"],
        },
      ],
      order: [["createdAt", "ASC"]],
      where: {
        ChatId: Number(chat_id),
      },
    });

    const data = messages.map((item) => {
      return {
        name: item.User.name,
        user_id: item.User.id,
        message: item.message,
        message_id: item.id,
        createdAt: item.createdAt,
        isFile: item?.isFile,
      };
    });

    return res.status(200).json({ success: true, data, myId: req.user.id });
  } catch (e) {
    return res.status(400).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  send_message,
  fetch_messages,
  fetch_users,
  create_group,
  fetch_chat_messages,
  fetch_all_groups,
  fetch_groups_details,
  update_groups_details,
  send__file_message,
};
