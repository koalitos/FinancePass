const { db } = require('../utils/database');

class ExpenseModel {
  static getAll(callback) {
    const sql = `SELECT e.*, c.name as category_name, c.color as category_color, c.icon as category_icon,
                 p.name as person_name FROM expenses e
                 LEFT JOIN categories c ON e.category_id = c.id
                 LEFT JOIN people p ON e.person_id = p.id
                 ORDER BY e.date DESC`;
    db.all(sql, callback);
  }

  static getById(id, callback) {
    const sql = `SELECT e.*, c.name as category_name, p.name as person_name FROM expenses e
                 LEFT JOIN categories c ON e.category_id = c.id
                 LEFT JOIN people p ON e.person_id = p.id
                 WHERE e.id = ?`;
    db.get(sql, [id], callback);
  }

  static create(data, callback) {
    const sql = `INSERT INTO expenses (description, amount, category_id, payment_method, date, 
                 is_recurring, recurrence_type, person_id, is_paid_back, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [data.description, data.amount, data.category_id, data.payment_method, data.date,
                 data.is_recurring || 0, data.recurrence_type, data.person_id, data.is_paid_back || 0, data.notes], 
           function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  static update(id, data, callback) {
    const sql = `UPDATE expenses SET description = ?, amount = ?, category_id = ?, payment_method = ?, 
                 date = ?, is_recurring = ?, recurrence_type = ?, person_id = ?, is_paid_back = ?, 
                 paid_back_date = ?, notes = ? WHERE id = ?`;
    db.run(sql, [data.description, data.amount, data.category_id, data.payment_method, data.date,
                 data.is_recurring, data.recurrence_type, data.person_id, data.is_paid_back, 
                 data.paid_back_date, data.notes, id], callback);
  }

  static delete(id, callback) {
    db.run('DELETE FROM expenses WHERE id = ?', [id], callback);
  }

  static getByMonth(year, month, callback) {
    const sql = `SELECT e.*, c.name as category_name, c.color as category_color FROM expenses e
                 LEFT JOIN categories c ON e.category_id = c.id
                 WHERE strftime('%Y', e.date) = ? AND strftime('%m', e.date) = ?
                 ORDER BY e.date DESC`;
    db.all(sql, [year.toString(), month.toString().padStart(2, '0')], callback);
  }

  static getByCategory(callback) {
    const sql = `SELECT c.name, c.color, c.icon, SUM(e.amount) as total FROM expenses e
                 JOIN categories c ON e.category_id = c.id
                 GROUP BY c.id ORDER BY total DESC`;
    db.all(sql, callback);
  }

  static getByPerson(personId, callback) {
    const sql = `SELECT e.*, c.name as category_name FROM expenses e
                 LEFT JOIN categories c ON e.category_id = c.id
                 WHERE e.person_id = ? ORDER BY e.date DESC`;
    db.all(sql, [personId], callback);
  }
}

module.exports = ExpenseModel;
