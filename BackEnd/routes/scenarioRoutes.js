const scenarioController = require('../controllers/scenarioController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');
router.post('/api/scenario/:id', isAuth, scenarioController.insert);
router.get('/api/scenario/all', isAuth, scenarioController.get);
router.delete('/api/scenario/:id', isAuth, scenarioController.delete);
router.put('/api/scenario/:id', isAuth, scenarioController.update);

module.exports = router;