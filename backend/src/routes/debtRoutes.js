const express = require('express');
const router = express.Router();
const DebtController = require('../controllers/debtController');

router.get('/', DebtController.getAll);
router.get('/:id', DebtController.getById);
router.post('/', DebtController.create);
router.put('/:id', DebtController.update);
router.delete('/:id', DebtController.delete);
router.post('/:id/payment', DebtController.addPayment);
router.get('/:id/payments', DebtController.getPayments);

module.exports = router;
