const pCurveController = require('../controllers/pCurveController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/pcurve', isAuth, pCurveController.insert);
router.get('/api/pcurve', isAuth, pCurveController.get);
router.put('/api/pcurve/:id_as', isAuth, pCurveController.update);
router.delete('/api/pcurve/:id_as', isAuth, pCurveController.delete);

module.exports = router;