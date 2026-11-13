const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/', historyController.getHistory);
router.get('/export', historyController.exportCsv);
router.delete('/clear', historyController.clearHistory);

module.exports = router;