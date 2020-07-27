const physiologicalP = require('../controllers/physiologicalParameterController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/physiologicalParameter', isAuth, physiologicalP.insert);
router.get('/api/physiologicalParameter', isAuth, physiologicalP.get);
router.put('/api/physiologicalParameter/:id', isAuth, physiologicalP.update);
router.delete('/api/physiologicalParameter/:id', isAuth, physiologicalP.delete);

module.exports = router;