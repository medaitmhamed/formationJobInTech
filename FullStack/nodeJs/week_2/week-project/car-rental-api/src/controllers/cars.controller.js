const carsService = require('../services/cars.service');

const getAllCars = (req, res, next) => {
  try {
    const { category, available, minPrice, maxPrice, q } = req.query;
    const filters = { category, available, minPrice, maxPrice, q };
    const cars = carsService.getFilteredCars(filters);
    res.json(cars);
  } catch (error) {
    next(error);
  }
};

const getCarById = (req, res, next) => {
  try {
    const car = carsService.getCarById(req.params.id);
    if (!car) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(car);
  } catch (error) {
    next(error);
  }
};

const createCar = (req, res, next) => {
  try {
    const { brand, model, category, plate, pricePerDay } = req.body;

    // Validation
    if (!brand || !model || !category || !plate || !pricePerDay) {
      const error = new Error('Missing required fields: brand, model, category, plate, pricePerDay');
      error.statusCode = 400;
      throw error;
    }

    const validCategories = ['eco', 'sedan', 'suv', 'van'];
    if (!validCategories.includes(category)) {
      const error = new Error(`Category must be one of: ${validCategories.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    if (pricePerDay <= 0) {
      const error = new Error('pricePerDay must be greater than 0');
      error.statusCode = 400;
      throw error;
    }

    const newCar = carsService.createCar({ brand, model, category, plate, pricePerDay });
    res.status(201).json(newCar);
  } catch (error) {
    next(error);
  }
};

const updateCar = (req, res, next) => {
  try {
    const updatedCar = carsService.updateCar(req.params.id, req.body);
    if (!updatedCar) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(updatedCar);
  } catch (error) {
    next(error);
  }
};

const deleteCar = (req, res, next) => {
  try {
    const deleted = carsService.deleteCar(req.params.id);
    if (!deleted) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: 'Car deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
}