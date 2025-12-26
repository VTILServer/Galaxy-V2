const {
  writeResponseMessage,
  writeErrorMessage,
} = require("../helpers/messages");

module.exports = {
  name: "Ban",
  rank: 3,
  list: ["ban"],
  description: "Ban a user by ID",
  callback: async (message, speaker, channel, guild) => {
    const id = message.match(/(\d+)/)?.[1];
    if (!id) return writeErrorMessage("No member specified!", channel, speaker);
    const member = await guild.members.fetch(id).catch(() => null);
    if (!member)
      return writeErrorMessage("Cannot find member!", channel, speaker);
    await member.ban({ reason: `Banned by ${speaker.user.tag}` });
    return writeResponseMessage(
      "Ban",
      `Banned <@${member.id}>`,
      channel,
      speaker
    );
  },
};
