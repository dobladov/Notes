var sqlite3 = require('sqlite3').verbose();

// Database initialization
var db = new sqlite3.Database(__dirname +'/notes.db');
db.run("CREATE TABLE IF NOT EXISTS notes (title TEXT, content TEXT, date timestamp, deleted INT, archived INT, categoryID INT, color INT)");
db.run("CREATE TABLE IF NOT EXISTS categories (name TEXT)");
