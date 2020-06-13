const userControllers = require ('../controllers/userControllers');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/auth/login',  userControllers.login);
router.post('/api/auth/register', userControllers.register);
router.put('/api/user/:id', isAuth, userControllers.update);
router.delete('/api/user/:id', isAuth, userControllers.delete);



module.exports = router;