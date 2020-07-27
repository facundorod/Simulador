const ppPerAsController = require('../controllers/ppPerAsController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/ppPerAs', isAuth, ppPerAsController.insert);
router.get('/api/ppPerAs', isAuth, ppPerAsController.get);
router.delete('/api/ppPerAs/:id_med', isAuth, ppPerAsController.delete);
router.put('/api/ppPerAs/:id_med', isAuth, ppPerAsController.update);

module.exports = router;