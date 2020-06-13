const pathologyController = require('../controllers/pathologyController');
const express = require('express');
const router = express.Router();

router.post('/api/pathology/:id', pathologyController.insert);
router.get('/api/pathology/all', pathologyController.get);
router.delete('/api/pathology/:id', pathologyController.delete);
router.put('/api/pathology/:id', pathologyController.update);

module.exports = router;