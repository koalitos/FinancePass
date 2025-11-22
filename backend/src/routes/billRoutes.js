const express = require('express');
const router = express.Router();
const controller = require('../controllers/billController');

// Contas recorrentes
router.get('/recurring', controller.getAllRecurring);
router.get('/recurring/:id', controller.getRecurringById);
router.post('/recurring', controller.createRecurring);
router.put('/recurring/:id', controller.updateRecurring);
router.delete('/recurring/:id', controller.deleteRecurring);

// Pagamentos
router.get('/payments', controller.getAllPayments);
router.get('/payments/overdue', controller.getOverduePayments);
router.get('/payments/upcoming', controller.getUpcomingPayments);
router.put('/payments/:id/pay', controller.markAsPaid);
router.post('/payments/generate/:year/:month', controller.generateMonthlyPayments);

module.exports = router;
