const arrythmiaController = require('../controllers/arrythmiaController');
const express = require('express');
const router = express.Router();

router.post('/api/arrythmia/insert', arrythmiaController.insert);
router.get('/api/arrythmia/get', arrythmiaController.get);
router.post('/api/arrythmia/update', arrythmiaController.update);
router.post('/api/arrythmia/delete', arrythmiaController.delete);

module.exports = router;