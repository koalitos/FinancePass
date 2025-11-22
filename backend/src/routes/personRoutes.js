const express = require('express');
const router = express.Router();
const controller = require('../controllers/personController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/expenses', controller.getExpenses);
router.get('/:id/summary', controller.getSummary);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
