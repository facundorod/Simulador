const userControllers = require ('../controllers/userControllers');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


router.get('/api/getUsers', userControllers.getUsers);
router.post('/api/updateUser', auth, userControllers.updateUsers);
router.post('/api/createUser', auth, userControllers.createUser);
router.post('/api/login', userControllers.login);
router.post('/api/register', userControllers.register);


module.exports = router;