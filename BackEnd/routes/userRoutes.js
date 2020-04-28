const userControllers = require ('../controllers/userControllers');
const express = require('express');
const router = express.Router();

router.post('/api/login',  userControllers.login);
router.post('/api/register', userControllers.register);


module.exports = router;