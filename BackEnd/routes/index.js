const users = ['Facundo', 'Claudio'];
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Veterinary anesthesiology simulator');
});

router.get('/api/about', (req, res) => {
  res.send('Informaci�n');
});
router.get('/api/users', (req, res) => {
  res.send(users);
});

module.exports = router;
