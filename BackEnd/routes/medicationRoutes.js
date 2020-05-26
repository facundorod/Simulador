const medicationController = require('../controllers/medicationController');
const express = require('express');
const router = express.Router();

router.post('/api/medication/insert', medicationController.insert);
router.get('/api/medication/get', medicationController.get);
router.post('/api/medication/delete', medicationController.deleteMed);
router.post('/api/medication/update', medicationController.update);

module.exports = router;