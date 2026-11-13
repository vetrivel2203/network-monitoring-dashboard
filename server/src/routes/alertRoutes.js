const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/active', alertController.getActiveAlerts);
router.get('/settings', alertController.getSettings);
router.put('/settings', alertController.updateSettings);

module.exports = router;