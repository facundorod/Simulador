const users = ['Facundo', 'Claudio'];
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Simulador de anestesiolog�a veterinaria');
});

router.get('/api/about', (req, res) => {
  res.send('Informaci�n');
});
router.get('/api/users', (req, res) => {
  res.send(users);
});

module.exports = router;
