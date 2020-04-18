const userControllers = require ('../controllers/userControllers');
const express = require('express');
const router = express.Router();
const errors = require('../middleware/errors');

router.post('/api/login', errors, userControllers.login);
router.post('/api/register', errors,  userControllers.register);


module.exports = router;