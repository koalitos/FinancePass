const express = require('express');
const router = express.Router();
const controller = require('../controllers/budgetController');

// Orçamentos
router.get('/', controller.getAll);
router.get('/:year/:month', controller.getByMonth);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

// Análise de orçamento
router.get('/analysis/:year/:month', controller.getAnalysis);

module.exports = router;
