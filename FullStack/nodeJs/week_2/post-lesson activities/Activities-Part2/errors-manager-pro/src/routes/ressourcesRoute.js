const express = require('express');
const router = express.Router();
const {
  getAllResources,
  getResourceById,
  addResource,
  updateResource,
  deleteResource
} = require('../controllers/ressourcesController');

router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.post('/', addResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

module.exports = router;