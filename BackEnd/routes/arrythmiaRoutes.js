const arrythmiaController = require('../controllers/arrythmiaController');
const express = require('express');
const router = express.Router();

router.post('/api/arrhythmias/insert', arrythmiaController.insert);
router.get('/api/arrhythmias/all', arrythmiaController.get);
router.put('/api/arrhythmias/update', arrythmiaController.update);
router.delete('/api/arrhythmias/delete', arrythmiaController.delete);

module.exports = router;