const express = require('express');
const router = express.Router();
const controller = require('../controllers/goalController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/progress', controller.updateProgress);
router.delete('/:id', controller.delete);

module.exports = router;
