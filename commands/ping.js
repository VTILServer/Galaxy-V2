const { writeResponseMessage } = require("../helpers/messages");

module.exports = {
  name: "Ping",
  rank: 0,
  list: ["ping", "echo"],
  description: "Replies with Pong or your message",
  callback: (message, speaker, channel) => {
    const reply = message.length === 0 ? "Pong" : message;
    return writeResponseMessage("Ping", reply, channel, speaker);
  },
};
