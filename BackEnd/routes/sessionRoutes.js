const sessionController = require('../controllers/sessionController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/session/:id', isAuth, sessionController.insert);
router.get('/api/session/all', isAuth, sessionController.get);
router.delete('/api/session/:id', isAuth, sessionController.delete);

module.exports = router;