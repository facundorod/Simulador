const animalSpeciesController = require('../controllers/animalSpeciesController');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');

router.post('/api/animalSpecies/:id', isAuth, animalSpeciesController.insert);
router.get('/api/animalSpecies/all', isAuth, animalSpeciesController.get);
router.delete('/api/animalSpecies/:id', isAuth, animalSpeciesController.delete);
router.put('/api/animalSpecies/:id', isAuth, animalSpeciesController.update);

module.exports = router;