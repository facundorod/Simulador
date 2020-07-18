const animalSpeciesController = require('../controllers/animalSpeciesController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/animalSpecies', isAuth, animalSpeciesController.insert);
router.get('/api/animalSpecies', isAuth, animalSpeciesController.get);
router.delete('/api/animalSpecies/:id_as', isAuth, animalSpeciesController.delete);
router.put('/api/animalSpecies/:id_as', isAuth, animalSpeciesController.update);

module.exports = router;