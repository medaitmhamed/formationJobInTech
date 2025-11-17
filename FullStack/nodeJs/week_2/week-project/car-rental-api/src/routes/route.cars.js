const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const carsController = require('../controllers/cars.controller');

router.get('/', carsController.getAllCars);
router.get('/:id', carsController.getCarById);
router.post('/', auth, carsController.createCar);
router.put('/:id', auth, carsController.updateCar);
router.delete('/:id', auth, carsController.deleteCar);

module.exports = router;