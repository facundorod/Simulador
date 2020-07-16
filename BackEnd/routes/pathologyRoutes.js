const pathologyController = require('../controllers/pathologyController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/pathology', isAuth, pathologyController.insert);
router.get('/api/pathology', isAuth, pathologyController.get);
router.delete('/api/pathology/:id_pat', isAuth, pathologyController.delete);
router.put('/api/pathology/:id_pat', isAuth, pathologyController.update);

module.exports = router;