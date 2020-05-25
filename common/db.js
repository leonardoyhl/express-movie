let sqlite3 = require('sqlite3').verbose();

let dbPath = require('path').join(__dirname, '../database/mrs.db');
let db = new sqlite3.Database(dbPath);

module.exports = db;