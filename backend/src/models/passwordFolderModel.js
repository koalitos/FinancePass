const { db } = require('../utils/database');

class PasswordFolderModel {
  static getAll(callback) {
    const sql = `SELECT * FROM password_folders ORDER BY name ASC`;
    db.all(sql, callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM password_folders WHERE id = ?', [id], callback);
  }

  static create(data, callback) {
    const sql = `INSERT INTO password_folders (name, icon, color, parent_id) 
                 VALUES (?, ?, ?, ?)`;
    db.run(sql, [
      data.name, 
      data.icon || '📁', 
      data.color || '#3b82f6', 
      data.parent_id
    ], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  static update(id, data, callback) {
    const sql = `UPDATE password_folders SET name = ?, icon = ?, color = ?, parent_id = ? 
                 WHERE id = ?`;
    db.run(sql, [data.name, data.icon, data.color, data.parent_id, id], callback);
  }

  static delete(id, callback) {
    // Primeiro, remover a pasta dos passwords
    db.run('UPDATE passwords SET folder_id = NULL WHERE folder_id = ?', [id], (err) => {
      if (err) return callback(err);
      // Depois deletar a pasta
      db.run('DELETE FROM password_folders WHERE id = ?', [id], callback);
    });
  }

  static getPasswordsByFolder(folderId, callback) {
    const sql = `SELECT * FROM passwords WHERE folder_id = ? ORDER BY title ASC`;
    db.all(sql, [folderId], callback);
  }
}

module.exports = PasswordFolderModel;
