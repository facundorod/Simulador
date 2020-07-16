const arrythmiaController = require('../controllers/arrythmiaController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/arrhythmias', isAuth, arrythmiaController.insert);
router.get('/api/arrhythmias', isAuth, arrythmiaController.get);
router.put('/api/arrhythmias/:id_arr', isAuth, arrythmiaController.update);
router.delete('/api/arrhythmias/:id_arr', isAuth, arrythmiaController.delete);

module.exports = router;