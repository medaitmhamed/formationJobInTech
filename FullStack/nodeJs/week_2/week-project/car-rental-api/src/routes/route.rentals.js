const express = require('express');
const router = express.Router();
const rentalsController = require('../controllers/rentals.controller');

router.get('/', rentalsController.getAllRentals);
router.get('/:id', rentalsController.getRentalById);
router.post('/', rentalsController.createRental);
router.put('/:id/return', rentalsController.returnCar);
router.delete('/:id', rentalsController.cancelRental);

module.exports = router;