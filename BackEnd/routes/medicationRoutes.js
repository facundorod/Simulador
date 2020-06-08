const medicationController = require('../controllers/medicationController');
const express = require('express');
const router = express.Router();

router.post('/api/medication/insert', medicationController.insert);
router.get('/api/medication/get', medicationController.get);
router.delete('/api/medication/:med', medicationController.deleteMed);
router.put('/api/medication/:med', medicationController.update);

module.exports = router;