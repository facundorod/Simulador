const arrhythmiaPerScenarioController = require('../controllers/arrhythmiaPerScenarioController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/arrhythmiaPerScenario', isAuth, arrhythmiaPerScenarioController.insert);
router.get('/api/arrhythmiaPerScenario', isAuth, arrhythmiaPerScenarioController.get);
router.delete('/api/arrhythmiaPerScenario/:id_arr', isAuth, arrhythmiaPerScenarioController.delete);

module.exports = router;

