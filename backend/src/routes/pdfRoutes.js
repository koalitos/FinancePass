const express = require('express');
const router = express.Router();
const controller = require('../controllers/pdfController');

router.get('/monthly/:year/:month', controller.exportMonthlyReport);
router.get('/person-report/:personId', controller.exportPersonReport);

module.exports = router;
