const express = require('express');
const router = express.Router();
const controller = require('../controllers/installmentController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/expenses', controller.getExpenses);
router.post('/', controller.create);
router.delete('/:id', controller.delete);

module.exports = router;
