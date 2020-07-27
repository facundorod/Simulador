const scenarioSimulation = require('../controllers/scenarioPerSimulationController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/scenarioSimulation', isAuth, scenarioSimulation.insert);
router.get('/api/scenarioSimulation', isAuth, scenarioSimulation.get);
router.delete('/api/scenarioSimulation/:id_scenario', isAuth, scenarioSimulation.delete);
router.put('/api/scenarioSimulation/:id_scenario', isAuth, scenarioSimulation.update);

module.exports = router;