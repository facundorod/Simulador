const pathologyController = require('../controllers/pathologyController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/pathology/:id', isAuth, pathologyController.insert);
router.get('/api/pathology/all', isAuth, pathologyController.get);
router.delete('/api/pathology/:id', isAuth, pathologyController.delete);
router.put('/api/pathology/:id', isAuth, pathologyController.update);

module.exports = router;