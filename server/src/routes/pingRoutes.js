const express = require('express');
const router = express.Router();
const pingController = require('../controllers/pingController');

router.post('/probe', pingController.executePing);
router.get('/overview', pingController.getOverviewStats);

module.exports = router;