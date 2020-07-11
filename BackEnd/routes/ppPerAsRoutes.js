const ppPerAsController = require('../controllers/ppPerAsController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/ppPerAs/:med', isAuth, ppPerAsController.insert);
router.get('/api/ppPerAs/all', isAuth, ppPerAsController.get);
router.delete('/api/ppPerAs/:med', isAuth, ppPerAsController.delete);
router.put('/api/ppPerAs/:med', isAuth, ppPerAsController.update);

module.exports = router;