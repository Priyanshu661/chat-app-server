const { CronJob } = require("cron");
const { Op } = require("sequelize");
const Message = require("../models/Message");
const ArchivedChat = require("../models/ArchivedMessage");
 
exports.job = new CronJob(
  "0 0 * * *",
  function () {
    archiveOldChats();
  },
  null,
  false,
  "Asia/Kolkata"
);

const  archiveOldChats=async()=> {
  try {
    const oneDaysAgo = new Date();
    oneDaysAgo.setDate(tenDaysAgo.getDate() - 1);
    // Find records to archive
    const messages = await Message.findAll({
      where: {
        date_time: {
          [Op.lt]: oneDaysAgo,
        },
      },
    });

    // Archive records
    await Promise.all(
      messages.map(async (item) => {
        await ArchivedChat.create({
          id: item.id,
          message: item.message,
          isFile: item.isFile,
          UserId: item.UserId,
          ChatId: item.ChatId,
        });
        await item.destroy();
      })
    );
    console.log("Messages archived successfully.");
  } catch (error) {
    console.error("Error archiving old records:", error);
  }
}

