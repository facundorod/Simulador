const medicationController = require('../controllers/medicationController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/medication', isAuth, medicationController.insert);
router.get('/api/medication', isAuth, medicationController.get);
router.delete('/api/medication/:id_med', isAuth, medicationController.deleteMed);
router.put('/api/medication/:id_med', isAuth, medicationController.update);

module.exports = router;