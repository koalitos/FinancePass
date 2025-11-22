const BillModel = require('../models/billModel');
const ExpenseModel = require('../models/expenseModel');

// Contas recorrentes
exports.getAllRecurring = (req, res) => {
  BillModel.getAllRecurring((err, bills) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(bills);
  });
};

exports.getRecurringById = (req, res) => {
  BillModel.getRecurringById(req.params.id, (err, bill) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  });
};

exports.createRecurring = (req, res) => {
  BillModel.createRecurring(req.body, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, message: 'Recurring bill created successfully' });
  });
};

exports.updateRecurring = (req, res) => {
  BillModel.updateRecurring(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Recurring bill updated successfully' });
  });
};

exports.deleteRecurring = (req, res) => {
  BillModel.deleteRecurring(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Recurring bill deleted successfully' });
  });
};

// Pagamentos
exports.getAllPayments = (req, res) => {
  BillModel.getAllPayments((err, payments) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(payments);
  });
};

exports.getOverduePayments = (req, res) => {
  BillModel.getOverduePayments((err, payments) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(payments);
  });
};

exports.getUpcomingPayments = (req, res) => {
  const days = req.query.days || 7;
  BillModel.getUpcomingPayments(days, (err, payments) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(payments);
  });
};

exports.markAsPaid = (req, res) => {
  const { paid_date, create_expense } = req.body;
  const paymentId = req.params.id;

  // Buscar o pagamento
  BillModel.getAllPayments((err, payments) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const payment = payments.find(p => p.id === parseInt(paymentId));
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (create_expense) {
      // Criar despesa automaticamente
      const expenseData = {
        description: payment.bill_name,
        amount: payment.amount,
        category_id: payment.category_id,
        payment_method: req.body.payment_method || 'bank_transfer',
        date: paid_date,
        notes: `Pagamento de conta: ${payment.bill_name}`
      };

      ExpenseModel.create(expenseData, (err, expenseId) => {
        if (err) return res.status(500).json({ error: err.message });
        
        BillModel.markAsPaid(paymentId, paid_date, expenseId, (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: 'Payment marked as paid and expense created' });
        });
      });
    } else {
      BillModel.markAsPaid(paymentId, paid_date, null, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Payment marked as paid' });
      });
    }
  });
};

exports.generateMonthlyPayments = (req, res) => {
  const { year, month } = req.params;
  BillModel.generateMonthlyPayments(parseInt(year), parseInt(month), (err, created) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `${created} payments generated`, created });
  });
};
