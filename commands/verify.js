// I WANT TO REWRITE THIS SHIT CODE 12/8/2025

const {
  writeResponseMessage,
  writeErrorMessage,
} = require("../helpers/messages");

module.exports = {
  name: "Verify",
  rank: 0,
  list: ["verify"],
  description: "Assigns the Verified role to the user",
  callback: async (args, member, channel, guild) => {
    try {
      let role = guild.roles.cache.find((r) => r.name === "Verified");

      if (!role) {
        role = await guild.roles.create({
          name: "Verified",
          color: "Green",
          reason: "Verification role required by Galaxy Bot",
        });
      }

      await member.roles.add(role);

      return writeResponseMessage(
        "Verification",
        `You have been verified and assigned the **${role.name}** role.`,
        channel,
        member
      );
    } catch (err) {
      return writeErrorMessage(
        `Verification error: ${err.message}`,
        channel,
        member
      );
    }
  },
};