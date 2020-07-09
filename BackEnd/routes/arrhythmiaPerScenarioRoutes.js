const arrhythmiaPerScenarioController = require('../controllers/arrhythmiaPerScenarioController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/arrhythmiaPerScenario/:id', isAuth, arrhythmiaPerScenarioController.insert);
router.get('/api/arrhythmiaPerScenario/all', isAuth, arrhythmiaPerScenarioController.get);
router.delete('/api/arrhythmiaPerScenario/:id', isAuth, arrhythmiaPerScenarioController.delete);

module.exports = router;

