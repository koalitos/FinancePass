const { db } = require('../utils/database');

class IncomeModel {
  static getAll(callback) {
    const sql = `SELECT i.*, c.name as category_name, c.color as category_color FROM incomes i
                 LEFT JOIN categories c ON i.category_id = c.id
                 ORDER BY i.date DESC`;
    db.all(sql, callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM incomes WHERE id = ?', [id], callback);
  }

  static create(data, callback) {
    const sql = `INSERT INTO incomes (description, amount, category_id, source, date, is_recurring, recurrence_type, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [data.description, data.amount, data.category_id, data.source, data.date, 
                 data.is_recurring || 0, data.recurrence_type, data.notes], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  static update(id, data, callback) {
    const sql = `UPDATE incomes SET description = ?, amount = ?, category_id = ?, source = ?, 
                 date = ?, is_recurring = ?, recurrence_type = ?, notes = ? WHERE id = ?`;
    db.run(sql, [data.description, data.amount, data.category_id, data.source, data.date,
                 data.is_recurring, data.recurrence_type, data.notes, id], callback);
  }

  static delete(id, callback) {
    db.run('DELETE FROM incomes WHERE id = ?', [id], callback);
  }

  static getByMonth(year, month, callback) {
    const sql = `SELECT i.*, c.name as category_name, c.color as category_color, c.icon as category_icon 
                 FROM incomes i
                 LEFT JOIN categories c ON i.category_id = c.id
                 WHERE strftime('%Y', i.date) = ? AND strftime('%m', i.date) = ?
                 ORDER BY i.date DESC`;
    db.all(sql, [year.toString(), month.toString().padStart(2, '0')], callback);
  }

  static getGroupedByMonth(callback) {
    const sql = `SELECT 
                   strftime('%Y', date) as year,
                   strftime('%m', date) as month,
                   COUNT(*) as count,
                   SUM(amount) as total
                 FROM incomes
                 GROUP BY year, month
                 ORDER BY year DESC, month DESC`;
    db.all(sql, callback);
  }
}

module.exports = IncomeModel;
