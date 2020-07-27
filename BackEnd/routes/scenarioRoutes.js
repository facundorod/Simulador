const scenarioController = require('../controllers/scenarioController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/scenario', isAuth, scenarioController.insert);
router.get('/api/scenario', isAuth, scenarioController.get);
router.delete('/api/scenario/:id_scenario', isAuth, scenarioController.delete);
router.put('/api/scenario/:id_scenario', isAuth, scenarioController.update);

module.exports = router;