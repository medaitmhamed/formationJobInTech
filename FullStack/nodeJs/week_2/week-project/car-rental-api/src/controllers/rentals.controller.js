const rentalsService = require('../services/rentals.service');

const getAllRentals = (req, res, next) => {
  try {
    const { status, from, to, carId } = req.query;
    const filters = { status, from, to, carId };
    const rentals = rentalsService.getFilteredRentals(filters);
    res.json(rentals);
  } catch (error) {
    next(error);
  }
};

const getRentalById = (req, res, next) => {
  try {
    const rental = rentalsService.getRentalById(req.params.id);
    if (!rental) {
      const error = new Error('Rental not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(rental);
  } catch (error) {
    next(error);
  }
};

const createRental = (req, res, next) => {
  try {
    const { carId, customer, from, to } = req.body;

    // Validation
    if (!carId || !customer || !customer.name || !customer.email || !from || !to) {
      const error = new Error('Missing required fields: carId, customer.name, customer.email, from, to');
      error.statusCode = 400;
      throw error;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      const error = new Error('Invalid email format');
      error.statusCode = 400;
      throw error;
    }

    // Date validation
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    if (isNaN(fromDate) || isNaN(toDate)) {
      const error = new Error('Invalid date format. Use YYYY-MM-DD');
      error.statusCode = 400;
      throw error;
    }

    if (fromDate >= toDate) {
      const error = new Error('from date must be before to date');
      error.statusCode = 400;
      throw error;
    }

    const newRental = rentalsService.createRental({ carId, customer, from, to });
    res.status(201).json(newRental);
  } catch (error) {
    next(error);
  }
};

const returnCar = (req, res, next) => {
  try {
    const rental = rentalsService.returnCar(req.params.id);
    if (!rental) {
      const error = new Error('Rental not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(rental);
  } catch (error) {
    next(error);
  }
};

const cancelRental = (req, res, next) => {
  try {
    const rental = rentalsService.cancelRental(req.params.id);
    if (!rental) {
      const error = new Error('Rental not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: 'Rental cancelled successfully', rental });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRentals,
  getRentalById,
  createRental,
  returnCar,
  cancelRental
};