const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenseController');

router.get('/', controller.getAll);
router.get('/grouped-by-month', controller.getGroupedByMonth);
router.get('/monthly/:year/:month', controller.getMonthly);
router.get('/category', controller.getByCategory);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
