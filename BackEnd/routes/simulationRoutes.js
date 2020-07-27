const express = require('express')
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const isAuth = require('../middleware/auth');

router.post('/api/simulation', isAuth, simulationController.insert);
router.get('/api/simulation', isAuth, simulationController.get);
router.put('/api/simulation/:id_simulation', isAuth, simulationController.update);
router.delete('/api/simulation/:id_simulation', isAuth, simulationController.delete);

module.exports = router;