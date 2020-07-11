const pCurveController = require('../controllers/pCurveController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/pcurve/:id', isAuth, pCurveController.insert);
router.get('/api/pcurve/all', isAuth, pCurveController.get);
router.put('/api/pcurve/:id', isAuth, pCurveController.update);
router.delete('/api/pcurve/:id', isAuth, pCurveController.delete);

module.exports = router;