const medicationController = require('../controllers/medicationController');
const express = require('express');
const router = express.Router();

router.post('/api/insertMedication', medicationController.insert);
router.get('/api/getMedication', medicationController.get);
router.post('/api/deleteMedication', medicationController.deleteMed);
router.post('/api/updateMedication', medicationController.update);

module.exports = router;