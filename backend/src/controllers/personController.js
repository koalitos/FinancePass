const PersonModel = require('../models/personModel');
const ExpenseModel = require('../models/expenseModel');

exports.getAll = (req, res) => {
  PersonModel.getAll((err, people) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(people);
  });
};

exports.getById = (req, res) => {
  PersonModel.getById(req.params.id, (err, person) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!person) return res.status(404).json({ error: 'Person not found' });
    res.json(person);
  });
};

exports.create = (req, res) => {
  PersonModel.create(req.body, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, message: 'Person created successfully' });
  });
};

exports.update = (req, res) => {
  PersonModel.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Person updated successfully' });
  });
};

exports.delete = (req, res) => {
  PersonModel.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Person deleted successfully' });
  });
};

exports.getExpenses = (req, res) => {
  ExpenseModel.getByPerson(req.params.id, (err, expenses) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(expenses);
  });
};

exports.getSummary = (req, res) => {
  PersonModel.getSummary(req.params.id, (err, summary) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(summary);
  });
};
