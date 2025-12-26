const { setString } = require("../galaxyDB");
const {
  writeResponseMessage,
  writeErrorMessage,
} = require("../helpers/messages");

module.exports = {
  name: "ModifyData",
  rank: 4,
  list: ["modifydata"],
  description: "Modify a user's string",
  callback: async (message, speaker, channel, guild) => {
    const split = message.match(/^(\S+)\s+(.+)/);
    if (!split)
      return writeErrorMessage("Incorrect command input!", channel, speaker);
    const id = split[1].match(/(\d+)/)?.[1];
    if (!id) return writeErrorMessage("No member specified!", channel, speaker);
    const member = await guild.members.fetch(id).catch(() => null);
    if (!member)
      return writeErrorMessage("Cannot find member!", channel, speaker);
    await setString(member.id, split[2]);
    return writeResponseMessage(
      "Modify Data",
      `Modified <@${member.id}>'s string to [${split[2]}]`,
      channel,
      speaker
    );
  },
};
