const { db } = require("../galaxyDB");
const {
  writeResponseMessage,
  writeErrorMessage,
} = require("../helpers/messages");

module.exports = {
  name: "WipeUserData",
  rank: 4,
  list: ["wipeuserdata"],
  description: "Delete a user's stored string",
  callback: async (message, speaker, channel) => {
    const id = message.match(/(\d+)/)?.[1];
    if (!id) return writeErrorMessage("No member specified!", channel, speaker);
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM strings WHERE id = ?", [id], (err) =>
        err ? reject(err) : resolve()
      );
    });
    return writeResponseMessage(
      "Wipe User Data",
      `Wiped data for user ${id}`,
      channel,
      speaker
    );
  },
};
