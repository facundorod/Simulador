const sppController = require('../controllers/sppController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/spp', isAuth, sppController.insert);
router.get('/api/spp', isAuth, sppController.get);
router.delete('/api/spp/:id_spp', isAuth, sppController.delete);
router.put('/api/spp/:id_spp', isAuth, sppController.update);

module.exports = router;