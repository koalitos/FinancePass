const { db } = require('../utils/database');

class InstallmentModel {
  static getAll(callback) {
    const sql = `SELECT i.*, c.name as category_name, c.color as category_color, c.icon as category_icon,
                 COUNT(e.id) as paid_installments
                 FROM installments i
                 LEFT JOIN categories c ON i.category_id = c.id
                 LEFT JOIN expenses e ON e.installment_id = i.id
                 GROUP BY i.id
                 ORDER BY i.start_date DESC`;
    db.all(sql, callback);
  }

  static getById(id, callback) {
    const sql = `SELECT i.*, c.name as category_name FROM installments i
                 LEFT JOIN categories c ON i.category_id = c.id
                 WHERE i.id = ?`;
    db.get(sql, [id], callback);
  }

  static create(data, callback) {
    const sql = `INSERT INTO installments (description, total_amount, installment_count, 
                 installment_value, category_id, payment_method, start_date, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const installmentValue = data.total_amount / data.installment_count;
    
    db.run(sql, [
      data.description, 
      data.total_amount, 
      data.installment_count, 
      installmentValue,
      data.category_id, 
      data.payment_method, 
      data.start_date, 
      data.notes
    ], function(err) {
      if (err) return callback(err);
      
      const installmentId = this.lastID;
      
      // Criar as parcelas como despesas
      const expenseSql = `INSERT INTO expenses (description, amount, category_id, payment_method, 
                          date, installment_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      
      const stmt = db.prepare(expenseSql);
      const startDate = new Date(data.start_date);
      
      for (let i = 0; i < data.installment_count; i++) {
        const installmentDate = new Date(startDate);
        installmentDate.setMonth(startDate.getMonth() + i);
        
        const description = `${data.description} (${i + 1}/${data.installment_count})`;
        const notes = `Parcela ${i + 1} de ${data.installment_count}`;
        
        stmt.run(
          description,
          installmentValue,
          data.category_id,
          data.payment_method,
          installmentDate.toISOString().split('T')[0],
          installmentId,
          notes
        );
      }
      
      stmt.finalize((err) => {
        callback(err, installmentId);
      });
    });
  }

  static delete(id, callback) {
    // Primeiro deletar as despesas relacionadas
    db.run('DELETE FROM expenses WHERE installment_id = ?', [id], (err) => {
      if (err) return callback(err);
      // Depois deletar a compra parcelada
      db.run('DELETE FROM installments WHERE id = ?', [id], callback);
    });
  }

  static getInstallmentExpenses(id, callback) {
    const sql = `SELECT e.*, c.name as category_name, c.color as category_color 
                 FROM expenses e
                 LEFT JOIN categories c ON e.category_id = c.id
                 WHERE e.installment_id = ?
                 ORDER BY e.date ASC`;
    db.all(sql, [id], callback);
  }
}

module.exports = InstallmentModel;
