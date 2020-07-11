const roleController = require('../controllers/roleController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/role/:med', isAuth, roleController.insert);
router.get('/api/role/all', isAuth, roleController.get);
router.delete('/api/role/:med', isAuth, roleController.delete);
router.put('/api/role/:med', isAuth, roleController.update);

module.exports = router;