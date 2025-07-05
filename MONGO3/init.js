const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

main()
  .then(() => {
    console.log("connection successful");
    console.log("Chats inserted!");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');

  let allChats = [
    {
      from: "neha",
      to: "priya",
      message: "send me your exam sheets",
      created_at: new Date(),
    },
    {
      from: "rohit",
      to: "mohit",
      message: "send me sheets",
      created_at: new Date(),
    },
    {
      from: "amit",
      to: "pr",
      message: "all the best",
      created_at: new Date(),
    },
  ];

  return Chat.insertMany(allChats); // <== return this!
}