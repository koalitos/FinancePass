const express = require('express');
const router = express.Router();
const IncomeController = require('../controllers/incomeController');

router.get('/grouped-by-month', IncomeController.getGroupedByMonth);
router.get('/monthly/:year/:month', IncomeController.getMonthly);
router.get('/', IncomeController.getAll);
router.get('/:id', IncomeController.getById);
router.post('/', IncomeController.create);
router.put('/:id', IncomeController.update);
router.delete('/:id', IncomeController.delete);

module.exports = router;
