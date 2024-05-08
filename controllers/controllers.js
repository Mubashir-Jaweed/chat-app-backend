const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Message = mongoose.model("Message");

module.exports.sendMessage = async (newMessage) => {
  try {
    const { to, from, message } = newMessage;

    if (!to || !from || !message) {
      return console.log("Not Found");
    }

    const mess = await new Message({
      to,
      from,
      message,
    }).save();

    return console.log("Message send successfully");
  } catch (error) {
    console.log({ error: error });
  }
};

module.exports.allMessages = async (user, selectedUser) => {
  try {
    const messages = await Message.find({
      $or:[{to:selectedUser},{from:user}]
    })
    return messages
  } catch (error) {
    console.log({ error: error });
  }
};
