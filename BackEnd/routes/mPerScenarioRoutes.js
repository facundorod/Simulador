const mPerScenarioController = require('../controllers/mPerScenarioController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/medScenario/:id', isAuth, mPerScenarioController.insert);
router.get('/api/medScenario/all', isAuth, mPerScenarioController.get);
router.put('/api/medScenario/:id', isAuth, mPerScenarioController.update);
router.delete('/api/medScenario/:id', isAuth, mPerScenarioController.delete);

module.exports = router;