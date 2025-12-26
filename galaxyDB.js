const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./galaxy.db");

db.run(`CREATE TABLE IF NOT EXISTS strings (
    id TEXT PRIMARY KEY,
    str TEXT
)`);

function getString(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT str FROM strings WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.str : null);
    });
  });
}

function setString(id, string) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO strings(id, str) VALUES(?, ?) ON CONFLICT(id) DO UPDATE SET str = excluded.str",
      [id, string],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

module.exports = { db, getString, setString };