const arrythmiaController = require('../controllers/arrythmiaController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/arrhythmias/:arr', isAuth, arrythmiaController.insert);
router.get('/api/arrhythmias/all', isAuth, arrythmiaController.get);
router.put('/api/arrhythmias/:arr', isAuth, arrythmiaController.update);
router.delete('/api/arrhythmias/:arr', isAuth, arrythmiaController.delete);

module.exports = router;