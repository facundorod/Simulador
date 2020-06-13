const animalSpeciesController = require('../controllers/animalSpeciesController');
const express = require('express');
const router = express.Router();

router.post('/api/animalSpecies/:id', animalSpeciesController.insert);
router.get('/api/animalSpecies/all', animalSpeciesController.get);
router.delete('/api/animalSpecies/:id', animalSpeciesController.delete);
router.put('/api/animalSpecies/:id', animalSpeciesController.update);

module.exports = router;