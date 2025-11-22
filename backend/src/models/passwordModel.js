const { db } = require('../utils/database');
const { encrypt, decrypt } = require('../utils/encryption');

class PasswordModel {
  static getAll(callback) {
    db.all('SELECT * FROM passwords ORDER BY favorite DESC, updated_at DESC', callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM passwords WHERE id = ?', [id], callback);
  }

  static create(data, callback) {
    const encryptedPassword = encrypt(data.password);
    const sql = `INSERT INTO passwords (title, username, email, password_encrypted, url, notes, category, folder_id, favorite) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [data.title, data.username, data.email, encryptedPassword, data.url, data.notes, data.category, data.folder_id || null, data.favorite || 0], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  static update(id, data, callback) {
    const encryptedPassword = data.password ? encrypt(data.password) : null;
    const sql = encryptedPassword
      ? `UPDATE passwords SET title = ?, username = ?, email = ?, password_encrypted = ?, url = ?, notes = ?, category = ?, folder_id = ?, favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      : `UPDATE passwords SET title = ?, username = ?, email = ?, url = ?, notes = ?, category = ?, folder_id = ?, favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    const params = encryptedPassword
      ? [data.title, data.username, data.email, encryptedPassword, data.url, data.notes, data.category, data.folder_id || null, data.favorite, id]
      : [data.title, data.username, data.email, data.url, data.notes, data.category, data.folder_id || null, data.favorite, id];
    
    db.run(sql, params, callback);
  }

  static delete(id, callback) {
    db.run('DELETE FROM passwords WHERE id = ?', [id], callback);
  }

  static search(term, callback) {
    const searchTerm = `%${term}%`;
    db.all('SELECT * FROM passwords WHERE title LIKE ? OR url LIKE ? OR category LIKE ?', 
           [searchTerm, searchTerm, searchTerm], callback);
  }

  static decryptPassword(encrypted) {
    return decrypt(encrypted);
  }
}

module.exports = PasswordModel;
