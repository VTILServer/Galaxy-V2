const {
  writeResponseMessage,
  writeErrorMessage,
} = require("../helpers/messages");
const Roles = {
  Sentinel: {
    Rank: 1,
    RoleName: "Sentinel", // Discord role name
    Permissions: [], // you can add specific perms if needed
  },
  Operator: {
    Rank: 2,
    RoleName: "Operator", // Discord role name
    Permissions: [], // add perms if needed
  },
};

module.exports = {
  name: "InitRoles",
  rank: 5, // only ROOT can run this
  list: ["initroles", "createroles", "setup"],
  description: "Create required roles for Galaxy if they do not exist",
  callback: async (args, member, channel, guild) => {
    try {
      let created = [];
      let existing = [];

      for (const roleDef of Object.values(Roles)) {
        if (!roleDef.RoleName) continue;

        // Check if role exists
        let role = guild.roles.cache.find((r) => r.name === roleDef.RoleName);
        if (!role) {
          // Create role
          role = await guild.roles.create({
            name: roleDef.RoleName,
            color: "Random",
            reason: "Galaxy Bot required role",
          });
          created.push(roleDef.RoleName);
        } else {
          existing.push(roleDef.RoleName);
        }
      }

      let msg = "";
      if (created.length) msg += `Created roles: ${created.join(", ")}\n`;
      if (existing.length) msg += `Already present: ${existing.join(", ")}\n`;

      return writeResponseMessage(
        "InitRoles",
        msg || "No roles needed.",
        channel,
        member
      );
    } catch (err) {
      return writeErrorMessage(
        `InitRoles error: ${err.message}`,
        channel,
        member
      );
    }
  },
};