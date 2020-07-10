const express = require('express')
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const isAuth = require('../middleware/auth');

router.post('/api/simulation/:id', isAuth, simulationController.insert);
router.get('/api/simulation/all', isAuth, simulationController.get);
router.put('/api/simulation/:id', isAuth, simulationController.update);
router.delete('/api/simulation/:id', isAuth, simulationController.delete);

module.exports = router;