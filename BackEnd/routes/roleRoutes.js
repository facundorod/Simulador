const roleController = require('../controllers/roleController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/role', isAuth, roleController.insert);
router.get('/api/role', isAuth, roleController.get);
router.delete('/api/role/:id_role', isAuth, roleController.delete);
router.put('/api/role/:id_role', isAuth, roleController.update);

module.exports = router;