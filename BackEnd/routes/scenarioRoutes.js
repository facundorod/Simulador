const scenarioController = require('../controllers/scenarioController');
const express = require('express');
const router = express.Router();

router.put('/api/scenario/:id', scenarioController.insert);
router.get('/api/scenario/getAll', scenarioController.get);
router.delete('/api/scenario/:id', scenarioController.delete);
router.post('/api/scenario/:id', scenarioController.update);

module.exports = router;