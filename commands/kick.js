const {
  writeResponseMessage,
  writeErrorMessage,
} = require("../helpers/messages");

module.exports = {
  name: "Kick",
  rank: 3,
  list: ["kick"],
  description: "Kick a user by ID",
  callback: async (message, speaker, channel, guild) => {
    const id = message.match(/(\d+)/)?.[1];
    if (!id) return writeErrorMessage("No member specified!", channel, speaker);
    const member = await guild.members.fetch(id).catch(() => null);
    if (!member)
      return writeErrorMessage("Cannot find member!", channel, speaker);
    await member.kick(`Kicked by ${speaker.user.tag}`);
    return writeResponseMessage(
      "Kick",
      `Kicked <@${member.id}>`,
      channel,
      speaker
    );
  },
};
