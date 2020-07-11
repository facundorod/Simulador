const scenarioSimulation = require('../controllers/scenarioPerSimulationController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/scenarioSimulation/:id', isAuth, scenarioSimulation.insert);
router.get('/api/scenarioSimulation/all', isAuth, scenarioSimulation.get);
router.delete('/api/scenarioSimulation/:id', isAuth, scenarioSimulation.delete);
router.put('/api/scenarioSimulation/:id', isAuth, scenarioSimulation.update);

module.exports = router;