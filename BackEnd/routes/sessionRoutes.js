const sessionController = require('../controllers/sessionController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/session', isAuth, sessionController.insert);
router.get('/api/session', isAuth, sessionController.get);
router.delete('/api/session/:id_session', isAuth, sessionController.delete);

module.exports = router;