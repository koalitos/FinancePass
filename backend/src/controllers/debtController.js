const { db } = require('../utils/database');

class DebtController {
  static getAll(req, res) {
    const sql = `
      SELECT d.*, p.name as person_name 
      FROM debts d
      JOIN people p ON d.person_id = p.id 
      ORDER BY d.created_at DESC
    `;
    
    db.all(sql, (err, debts) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(debts);
    });
  }

  static getById(req, res) {
    const sql = `
      SELECT d.*, p.name as person_name 
      FROM debts d
      JOIN people p ON d.person_id = p.id 
      WHERE d.id = ?
    `;
    
    db.get(sql, [req.params.id], (err, debt) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!debt) return res.status(404).json({ error: 'Debt not found' });
      res.json(debt);
    });
  }

  static create(req, res) {
    const { person_id, description, total_amount, type, due_date, notes } = req.body;

    if (!person_id || !description || !total_amount || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `
      INSERT INTO debts (person_id, description, total_amount, type, due_date, notes) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [person_id, description, total_amount, type, due_date, notes], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: 'Debt created successfully' });
    });
  }

  static update(req, res) {
    const { person_id, description, total_amount, type, due_date, notes } = req.body;
    
    const sql = `
      UPDATE debts 
      SET person_id = ?, description = ?, total_amount = ?, type = ?, due_date = ?, notes = ?
      WHERE id = ?
    `;

    db.run(sql, [person_id, description, total_amount, type, due_date, notes, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Debt updated successfully' });
    });
  }

  static delete(req, res) {
    db.run('DELETE FROM debts WHERE id = ?', [req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Debt deleted successfully' });
    });
  }

  static addPayment(req, res) {
    const { amount, payment_date, payment_method, notes } = req.body;
    const debtId = req.params.id;

    if (!amount || !payment_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertPaymentSql = `
      INSERT INTO debt_payments (debt_id, amount, payment_date, payment_method, notes) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(insertPaymentSql, [debtId, amount, payment_date, payment_method, notes], function(err) {
      if (err) return res.status(500).json({ error: err.message });

      // Atualizar valor pago da dívida
      const updateDebtSql = `
        UPDATE debts 
        SET paid_amount = paid_amount + ?, 
            status = CASE 
              WHEN paid_amount + ? >= total_amount THEN 'paid' 
              ELSE 'partial' 
            END 
        WHERE id = ?
      `;

      db.run(updateDebtSql, [amount, amount, debtId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
          id: this.lastID, 
          message: 'Payment registered successfully' 
        });
      });
    });
  }

  static getPayments(req, res) {
    const sql = `
      SELECT * FROM debt_payments 
      WHERE debt_id = ? 
      ORDER BY payment_date DESC
    `;

    db.all(sql, [req.params.id], (err, payments) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(payments);
    });
  }
}

module.exports = DebtController;
