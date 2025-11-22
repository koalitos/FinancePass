const { db } = require('../utils/database');

class BillModel {
  // Contas recorrentes
  static getAllRecurring(callback) {
    const sql = `SELECT rb.*, c.name as category_name, c.color as category_color, c.icon as category_icon
                 FROM recurring_bills rb
                 LEFT JOIN categories c ON rb.category_id = c.id
                 WHERE rb.is_active = 1
                 ORDER BY rb.due_day ASC`;
    db.all(sql, callback);
  }

  static getRecurringById(id, callback) {
    const sql = `SELECT rb.*, c.name as category_name FROM recurring_bills rb
                 LEFT JOIN categories c ON rb.category_id = c.id
                 WHERE rb.id = ?`;
    db.get(sql, [id], callback);
  }

  static createRecurring(data, callback) {
    const sql = `INSERT INTO recurring_bills (name, description, amount, category_id, due_day, 
                 is_active, auto_create, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [
      data.name, 
      data.description, 
      data.amount, 
      data.category_id, 
      data.due_day,
      data.is_active !== undefined ? data.is_active : 1,
      data.auto_create !== undefined ? data.auto_create : 1,
      data.notes
    ], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  static updateRecurring(id, data, callback) {
    const sql = `UPDATE recurring_bills SET name = ?, description = ?, amount = ?, 
                 category_id = ?, due_day = ?, is_active = ?, auto_create = ?, notes = ? 
                 WHERE id = ?`;
    db.run(sql, [
      data.name, 
      data.description, 
      data.amount, 
      data.category_id, 
      data.due_day,
      data.is_active,
      data.auto_create,
      data.notes,
      id
    ], callback);
  }

  static deleteRecurring(id, callback) {
    db.run('DELETE FROM recurring_bills WHERE id = ?', [id], callback);
  }

  // Pagamentos de contas
  static getAllPayments(callback) {
    const sql = `SELECT bp.*, rb.name as bill_name, rb.amount as bill_amount,
                 c.name as category_name, c.color as category_color
                 FROM bill_payments bp
                 LEFT JOIN recurring_bills rb ON bp.recurring_bill_id = rb.id
                 LEFT JOIN categories c ON rb.category_id = c.id
                 ORDER BY bp.due_date DESC`;
    db.all(sql, callback);
  }

  static getOverduePayments(callback) {
    const sql = `SELECT bp.*, rb.name as bill_name, rb.amount as bill_amount,
                 c.name as category_name, c.color as category_color, c.icon as category_icon
                 FROM bill_payments bp
                 LEFT JOIN recurring_bills rb ON bp.recurring_bill_id = rb.id
                 LEFT JOIN categories c ON rb.category_id = c.id
                 WHERE bp.status = 'pending' AND bp.due_date < date('now')
                 ORDER BY bp.due_date ASC`;
    db.all(sql, callback);
  }

  static getUpcomingPayments(days, callback) {
    const sql = `SELECT bp.*, rb.name as bill_name, rb.amount as bill_amount,
                 c.name as category_name, c.color as category_color
                 FROM bill_payments bp
                 LEFT JOIN recurring_bills rb ON bp.recurring_bill_id = rb.id
                 LEFT JOIN categories c ON rb.category_id = c.id
                 WHERE bp.status = 'pending' 
                 AND bp.due_date >= date('now')
                 AND bp.due_date <= date('now', '+' || ? || ' days')
                 ORDER BY bp.due_date ASC`;
    db.all(sql, [days], callback);
  }

  static createPayment(data, callback) {
    const sql = `INSERT INTO bill_payments (recurring_bill_id, expense_id, due_date, 
                 paid_date, amount, status, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [
      data.recurring_bill_id,
      data.expense_id,
      data.due_date,
      data.paid_date,
      data.amount,
      data.status || 'pending',
      data.notes
    ], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  static markAsPaid(id, paidDate, expenseId, callback) {
    const sql = `UPDATE bill_payments SET status = 'paid', paid_date = ?, expense_id = ? 
                 WHERE id = ?`;
    db.run(sql, [paidDate, expenseId, id], callback);
  }

  static deletePayment(id, callback) {
    db.run('DELETE FROM bill_payments WHERE id = ?', [id], callback);
  }

  // Gerar pagamentos do mês
  static generateMonthlyPayments(year, month, callback) {
    const sql = `SELECT * FROM recurring_bills WHERE is_active = 1 AND auto_create = 1`;
    
    db.all(sql, (err, bills) => {
      if (err) return callback(err);
      
      const monthStr = month.toString().padStart(2, '0');
      let created = 0;
      
      bills.forEach((bill, index) => {
        const dueDate = `${year}-${monthStr}-${bill.due_day.toString().padStart(2, '0')}`;
        
        // Verificar se já existe
        const checkSql = `SELECT id FROM bill_payments 
                         WHERE recurring_bill_id = ? 
                         AND strftime('%Y-%m', due_date) = ?`;
        
        db.get(checkSql, [bill.id, `${year}-${monthStr}`], (err, existing) => {
          if (!existing) {
            const insertSql = `INSERT INTO bill_payments (recurring_bill_id, due_date, amount, status) 
                              VALUES (?, ?, ?, 'pending')`;
            db.run(insertSql, [bill.id, dueDate, bill.amount], () => {
              created++;
              if (index === bills.length - 1) {
                callback(null, created);
              }
            });
          } else if (index === bills.length - 1) {
            callback(null, created);
          }
        });
      });
      
      if (bills.length === 0) {
        callback(null, 0);
      }
    });
  }
}

module.exports = BillModel;
