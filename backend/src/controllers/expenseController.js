const ExpenseModel = require('../models/expenseModel');

exports.getAll = (req, res) => {
  ExpenseModel.getAll((err, expenses) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(expenses);
  });
};

exports.getById = (req, res) => {
  ExpenseModel.getById(req.params.id, (err, expense) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  });
};

exports.create = (req, res) => {
  ExpenseModel.create(req.body, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, message: 'Expense created successfully' });
  });
};

exports.update = (req, res) => {
  ExpenseModel.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Expense updated successfully' });
  });
};

exports.delete = (req, res) => {
  ExpenseModel.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Expense deleted successfully' });
  });
};

exports.getMonthly = (req, res) => {
  const { year, month } = req.params;
  ExpenseModel.getByMonth(year, month, (err, expenses) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.json({ expenses, total });
  });
};

exports.getByCategory = (req, res) => {
  ExpenseModel.getByCategory((err, categories) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(categories);
  });
};

exports.getGroupedByMonth = (req, res) => {
  const sql = `SELECT 
                strftime('%Y', date) as year,
                strftime('%m', date) as month,
                COUNT(*) as count,
                SUM(amount) as total
               FROM expenses
               GROUP BY year, month
               ORDER BY year DESC, month DESC
               LIMIT 12`;
  
  const { db } = require('../utils/database');
  db.all(sql, (err, months) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(months);
  });
};
