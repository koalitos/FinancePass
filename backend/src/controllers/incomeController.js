const IncomeModel = require('../models/incomeModel');

class IncomeController {
  static getAll(req, res) {
    IncomeModel.getAll((err, incomes) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(incomes);
    });
  }

  static getById(req, res) {
    IncomeModel.getById(req.params.id, (err, income) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!income) return res.status(404).json({ error: 'Income not found' });
      res.json(income);
    });
  }

  static create(req, res) {
    const { description, amount, source, date, notes } = req.body;

    if (!description || !amount || !source) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    IncomeModel.create(req.body, (err, id) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, message: 'Income created successfully' });
    });
  }

  static update(req, res) {
    IncomeModel.update(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Income updated successfully' });
    });
  }

  static delete(req, res) {
    IncomeModel.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Income deleted successfully' });
    });
  }

  static getMonthly(req, res) {
    const { year, month } = req.params;
    IncomeModel.getByMonth(year, month, (err, incomes) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const total = incomes.reduce((sum, income) => sum + income.amount, 0);
      
      res.json({
        year,
        month,
        total,
        incomes
      });
    });
  }

  static getGroupedByMonth(req, res) {
    IncomeModel.getGroupedByMonth((err, months) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(months);
    });
  }
}

module.exports = IncomeController;
