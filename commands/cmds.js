module.exports = {
  name: "Cmds",
  rank: 0,
  list: ["cmds", "commands"],
  description: "Show all commands available for your rank",
  callback: async (args, member, channel, guild) => {
    try {
      const Galaxy = require("../bot"); // safe late access
      const Roles = Galaxy.Roles;
      const Commands = Galaxy.Commands;

      let rank = Roles.User.Rank;
      for (const role of Object.values(Roles)) {
        if (
          role.RoleName &&
          member.roles.cache.some((r) => r.name === role.RoleName)
        ) {
          rank = role.Rank;
        }
      }
      if (member.id === process.env.OWNER_ID) rank = Roles.Root.Rank;

      const available = Object.values(Commands).filter(
        (cmd) => cmd.rank <= rank
      );
      let output = `**Commands for Rank ${rank} (${
        Roles[Object.keys(Roles).find((k) => Roles[k].Rank === rank)]?.RoleName
      })**\n\n`;
      for (const cmd of available) {
        output += `• **${cmd.list.join(", ")}** → ${cmd.description}\n`;
      }

      return require("../helpers/messages").writeResponseMessage(
        "Cmds",
        output,
        channel,
        member
      );
    } catch (err) {
      return require("../helpers/messages").writeErrorMessage(
        `Cmds error: ${err.message}`,
        channel,
        member
      );
    }
  },
};
