const sppController = require('../controllers/sppController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/spp/:id', isAuth, sppController.insert);
router.get('/api/spp/all', isAuth, sppController.get);
router.delete('/api/spp/:id', isAuth, sppController.delete);
router.put('/api/spp/:id', isAuth, sppController.update);

module.exports = router;