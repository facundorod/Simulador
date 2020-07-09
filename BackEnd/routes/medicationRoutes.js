const medicationController = require('../controllers/medicationController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/medication/:med', isAuth, medicationController.insert);
router.get('/api/medication/all', isAuth, medicationController.get);
router.delete('/api/medication/:med', isAuth, medicationController.deleteMed);
router.put('/api/medication/:med', isAuth, medicationController.update);

module.exports = router;