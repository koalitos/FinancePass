const InstallmentModel = require('../models/installmentModel');

exports.getAll = (req, res) => {
  InstallmentModel.getAll((err, installments) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(installments);
  });
};

exports.getById = (req, res) => {
  InstallmentModel.getById(req.params.id, (err, installment) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!installment) return res.status(404).json({ error: 'Installment not found' });
    res.json(installment);
  });
};

exports.create = (req, res) => {
  InstallmentModel.create(req.body, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, message: 'Installment created successfully' });
  });
};

exports.delete = (req, res) => {
  InstallmentModel.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Installment deleted successfully' });
  });
};

exports.getExpenses = (req, res) => {
  InstallmentModel.getInstallmentExpenses(req.params.id, (err, expenses) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(expenses);
  });
};
