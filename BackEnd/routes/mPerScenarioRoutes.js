const mPerScenarioController = require('../controllers/mPerScenarioController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/medScenario', isAuth, mPerScenarioController.insert);
router.get('/api/medScenario', isAuth, mPerScenarioController.get);
router.put('/api/medScenario/:id_med', isAuth, mPerScenarioController.update);
router.delete('/api/medScenario/:id_med', isAuth, mPerScenarioController.delete);

module.exports = router;