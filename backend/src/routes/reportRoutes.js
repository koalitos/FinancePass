const express = require('express');
const router = express.Router();
const { db } = require('../utils/database');

router.get('/monthly/:year/:month', (req, res) => {
  const { year, month } = req.params;
  const dateFilter = `${year}-${month.padStart(2, '0')}`;
  
  const sql = `SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE strftime('%Y-%m', date) = ?) as income,
    (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE strftime('%Y-%m', date) = ?) as expenses`;
  
  db.get(sql, [dateFilter, dateFilter], (err, report) => {
    if (err) return res.status(500).json({ error: err.message });
    report.balance = report.income - report.expenses;
    res.json(report);
  });
});

module.exports = router;
