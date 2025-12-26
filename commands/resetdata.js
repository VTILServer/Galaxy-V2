const { db } = require("../galaxyDB");
const { writeResponseMessage } = require("../helpers/messages");

module.exports = {
  name: "ResetData",
  rank: 4,
  list: ["resetdata"],
  description: "Reset all stored strings",
  callback: async (message, speaker, channel) => {
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM strings", (err) => (err ? reject(err) : resolve()));
    });
    return writeResponseMessage(
      "Reset Data",
      "All data has been reset.",
      channel,
      speaker
    );
  },
};