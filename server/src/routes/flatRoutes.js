const express = require('express');
const router = express.Router();
const flatController = require('../controllers/flatController');

router.post('/dfa', flatController.simulateDfa);
router.post('/nfa', flatController.simulateNfa);
router.post('/regex', flatController.testRegex);
router.post('/cfg', flatController.generateCfg);
router.post('/pda', flatController.simulatePda);
router.post('/turing', flatController.simulateTuringMachine);

module.exports = router;