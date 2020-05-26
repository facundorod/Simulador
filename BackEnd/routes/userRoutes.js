const userControllers = require ('../controllers/userControllers');
const express = require('express');
const router = express.Router();

router.post('/api/user/login',  userControllers.login);
router.post('/api/user/register', userControllers.register);


module.exports = router;