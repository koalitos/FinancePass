const express = require('express');
const router = express.Router();
const { db } = require('../utils/database');

router.get('/summary', (req, res) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  
  const sql = `SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM incomes 
     WHERE strftime('%Y-%m', date) = ?) as total_income,
    (SELECT COALESCE(SUM(amount), 0) FROM expenses 
     WHERE strftime('%Y-%m', date) = ?) as total_expenses,
    (SELECT COALESCE(SUM(total_amount - paid_amount), 0) FROM debts 
     WHERE type = 'owes_me' AND status != 'paid') as total_owed,
    (SELECT COUNT(*) FROM passwords) as total_passwords`;
  
  db.get(sql, [`${year}-${month}`, `${year}-${month}`], (err, summary) => {
    if (err) return res.status(500).json({ error: err.message });
    summary.balance = summary.total_income - summary.total_expenses;
    res.json(summary);
  });
});

module.exports = router;
