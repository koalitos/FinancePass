const { db } = require('../utils/database');

class PersonModel {
  static getAll(callback) {
    db.all('SELECT * FROM people ORDER BY name', callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM people WHERE id = ?', [id], callback);
  }

  static create(data, callback) {
    const sql = `INSERT INTO people (name, relationship, phone, email, notes, avatar_color) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [data.name, data.relationship, data.phone, data.email, data.notes, data.avatar_color], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  static update(id, data, callback) {
    const sql = `UPDATE people SET name = ?, relationship = ?, phone = ?, email = ?, notes = ?, avatar_color = ? WHERE id = ?`;
    db.run(sql, [data.name, data.relationship, data.phone, data.email, data.notes, data.avatar_color, id], callback);
  }

  static delete(id, callback) {
    db.run('DELETE FROM people WHERE id = ?', [id], callback);
  }

  static getSummary(id, callback) {
    const sql = `SELECT 
                   (SELECT SUM(amount) FROM expenses WHERE person_id = ? AND is_paid_back = 0) as total_unpaid,
                   (SELECT SUM(amount) FROM expenses WHERE person_id = ? AND is_paid_back = 1) as total_paid,
                   (SELECT COUNT(*) FROM expenses WHERE person_id = ?) as total_expenses
                 FROM people WHERE id = ?`;
    db.get(sql, [id, id, id, id], callback);
  }
}

module.exports = PersonModel;
