const fs = require("fs");
const path = require("path");
const {
  writeResponseMessage,
  writeErrorMessage,
} = require("../helpers/messages");

module.exports = {
  name: "Changelog",
  rank: 0, // anyone can view changelogs
  list: ["changelog", "changes", "changelogs", "clogs", "clog"],
  description: "Show changelogs",
  callback: async (args, member, channel) => {
    try {
      const filePath = path.join(__dirname, "..", "changelog.txt");
      if (!fs.existsSync(filePath)) {
        return writeErrorMessage(
          "No changelog.txt file found.",
          channel,
          member
        );
      }

      const raw = fs.readFileSync(filePath, "utf8");
      const lines = raw.split(/\r?\n/);

      let bugFixes = [];
      let created = [];
      let revamped = [];

      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes("bug fix")) bugFixes.push(line.trim());
        else if (lower.includes("created")) created.push(line.trim());
        else if (lower.includes("revamped")) revamped.push(line.trim());
      }

      // Build AsciiDoc style output
      let output = "[Changelog]\n";
      if (bugFixes.length) {
        output += "\n== Bug Fixes ==\n";
        bugFixes.forEach((fix) => {
          output += `* ${fix}\n`;
        });
      }
      if (created.length) {
        output += "\n== Created ==\n";
        created.forEach((item) => {
          output += `* ${item}\n`;
        });
      }
      if (revamped.length) {
        output += "\n== Revamped ==\n";
        revamped.forEach((item) => {
          output += `* ${item}\n`;
        });
      }

      return writeResponseMessage(
        "Changelog",
        `\`\`\`asciidoc\n${output}\n\`\`\``,
        channel,
        member
      );
    } catch (err) {
      return writeErrorMessage(
        `Changelog error: ${err.message}`,
        channel,
        member
      );
    }
  },
};