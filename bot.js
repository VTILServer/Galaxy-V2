// Galaxy Bot V2 with SQLite
require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");

const sqlite3 = require("sqlite3").verbose();
const express = require("express");

const fs = require("fs");
const path = require("path");

const TOKEN = process.env.TOKEN;
const PORT = process.env.PORT || 3000;

// ---------------- SQLite ----------------
const { db, getString, setString } = require("./galaxyDB");

// ---------------- Galaxy Core ----------------
const Galaxy = {
  Roles: {
    User: {
      Rank: 0,
      Permissions: [
        { type: "permission", value: PermissionsBitField.Flags.SendMessages },
      ],
    },
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
    Moderator: {
      Rank: 3,
      RoleName: "Moderator",
      Permissions: [
        { type: "permission", value: PermissionsBitField.Flags.KickMembers },
        { type: "permission", value: PermissionsBitField.Flags.BanMembers },
      ],
    },
    Administrator: {
      Rank: 4,
      RoleName: "Administrator",
      Permissions: [
        { type: "permission", value: PermissionsBitField.Flags.Administrator },
      ],
    },
    Root: {
      Rank: 5,
      RoleName: "ROOT",
      Permissions: [
        { type: "other", value: "OWNER" },
        { type: "other", value: "CREATOR" },
      ],
    },
  },
  Settings: {
    Prefix: ";",
    CommandErrors: {
      NotifyRankExceeds: true,
      NotifyGeneralError: true,
      NotifyParsedError: true,
    },
    MaxOutputLength: 1000,
  },
  Commands: {},
};


// ---------------- Load Commands ----------------
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const cmd = require(path.join(commandsPath, file));
    Galaxy.Commands[cmd.name] = cmd;
  }
});

// ---------------- Discord Bot ----------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

function getMemberRank(member) {
  // Default to User
  let rank = Galaxy.Roles.User.Rank;

  // Check roles by name
  for (const role of Object.values(Galaxy.Roles)) {
    if (
      role.RoleName &&
      member.roles.cache.some((r) => r.name === role.RoleName)
    ) {
      rank = role.Rank;
    }
  }

  // Special case: Root (bot owner)
  if (member.id === process.env.OWNER_ID) {
    rank = Galaxy.Roles.Root.Rank;
  }

  return rank;
}


client.on("messageCreate", (message) => {
  if (!message.content.startsWith(Galaxy.Settings.Prefix) || message.author.bot)
    return;

  const content = message.content.slice(Galaxy.Settings.Prefix.length);
  const match = content.match(/(\S+)\s*(.*)/);

  const userRank = getMemberRank(message.member);

  for (const cmd of Object.values(Galaxy.Commands)) {
    if (
      cmd.list.some((alias) => alias.toLowerCase() === match[1].toLowerCase())
    ) {
      if (userRank < cmd.rank) {
        if (Galaxy.Settings.CommandErrors.NotifyRankExceeds) {
          message.channel.send(
            `You do not have permission to use this command (requires rank ${cmd.rank}).`
          );
        }
        return;
      }
      try {
        const rtn = cmd.callback(
          match[2],
          message.member,
          message.channel,
          message.guild,
          message
        );
        if (rtn instanceof Promise)
          rtn.catch((err) => message.channel.send(`Error: ${err}`));
      } catch (err) {
        message.channel.send(`Error: ${err}`);
      }
    }
  }
});

client.login(TOKEN);

// ---------------- Website ----------------
const app = express();

app.get("/", (req, res) => {
  const rows = Object.values(Galaxy.Commands)
    .map(
      (cmd) => `
        <tr>
            <td>${cmd.name}</td>
            <td>${cmd.rank}</td>
            <td>${cmd.list.join(", ")}</td>
            <td>${cmd.description}</td>
        </tr>`
    )
    .join("");

  res.send(`
        <html>
        <head>
            <title>Galaxy Bot Commands</title>
            <style>
                body { background-color: #2e2e2e; color: #f0f0f0; font-family: sans-serif; }
                table { border-collapse: collapse; width: 80%; margin: 20px auto; }
                th, td { border: 1px solid #555; padding: 8px; }
                th { background-color: #444; }
                tr:nth-child(even) { background-color: #3a3a3a; }
                h1 { text-align: center; }
                a { color: #66ccff; }
            </style>
        </head>
        <body>
            <h1>Galaxy Bot Commands</h1>
            <table>
                <tr><th>Name</th><th>Rank</th><th>Aliases</th><th>Description</th></tr>
                ${rows}
            </table>
            <p style="text-align:center;">View a user string: <code>/strings/{userId}</code></p>
        </body>
        </html>
    `);
});

// New route to view stored strings
app.get("/strings/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const str = await getString(id);
    res.send(`
            <html>
            <head>
                <title>User String</title>
                <style>
                    body { background-color: #2e2e2e; color: #f0f0f0; font-family: sans-serif; }
                    h1 { text-align: center; }
                    a { color: #66ccff; }
                </style>
            </head>
            <body>
                <h1>User String</h1>
                <p><strong>User ID:</strong> ${id}</p>
                <p><strong>String:</strong> ${str ? str : "(none found)"}</p>
                <p style="text-align:center;"><a href="/">Back to commands</a></p>
            </body>
            </html>
        `);
  } catch (err) {
    res.status(500).send("Error retrieving string: " + err);
  }
});

// Start the web server
app.listen(PORT, () =>
  console.log(`Website running on http://localhost:${PORT}`)
);

module.exports = {
  Settings: Galaxy.Settings,
  Roles: Galaxy.Roles,
  Commands: Galaxy.Commands,
};