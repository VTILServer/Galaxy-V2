const {
  writeResponseMessage,
  writeErrorMessage,
} = require("../helpers/messages");

module.exports = {
  name: "Unban",
  rank: 3,
  list: ["unban"],
  description: "Unban a user by ID",
  callback: async (message, speaker, channel, guild) => {
    const id = message.match(/(\d+)/)?.[1];
    if (!id) return writeErrorMessage("No user specified!", channel, speaker);
    await guild.members.unban(id).catch(() => {
      return writeErrorMessage("Cannot unban user!", channel, speaker);
    });
    return writeResponseMessage(
      "Unban",
      `Unbanned user ${id}`,
      channel,
      speaker
    );
  },
};
