const { db } = require('../utils/database');
const crypto = require('crypto');

class UserModel {
  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    db.run(sql);
  }

  static hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  static create(username, password, name, callback) {
    const hashedPassword = this.hashPassword(password);
    const sql = 'INSERT INTO users (username, password, name) VALUES (?, ?, ?)';
    db.run(sql, [username, hashedPassword, name], function(err) {
      callback(err, this.lastID);
    });
  }

  static findByUsername(username, callback) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], callback);
  }

  static authenticate(username, password, callback) {
    const hashedPassword = this.hashPassword(password);
    const sql = 'SELECT id, username, name FROM users WHERE username = ? AND password = ?';
    db.get(sql, [username, hashedPassword], callback);
  }

  static count(callback) {
    const sql = 'SELECT COUNT(*) as count FROM users';
    db.get(sql, callback);
  }
}

module.exports = UserModel;
