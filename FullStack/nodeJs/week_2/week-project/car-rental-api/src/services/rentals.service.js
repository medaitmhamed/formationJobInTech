const fs = require('fs');
const path = require('path');
const carsService = require('./carsService');

const rentalsFilePath = path.join(__dirname, '../data/rentals.json');

const readRentals = () => {
  try {
    const data = fs.readFileSync(rentalsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeRentals = (rentals) => {
  fs.writeFileSync(rentalsFilePath, JSON.stringify(rentals, null, 2));
};

const overlaps = (aFrom, aTo, bFrom, bTo) => {
  return aFrom < bTo && bFrom < aTo;
};

const calculateDays = (from, to) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffTime = toDate - fromDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
};

const getFilteredRentals = (filters) => {
  let rentals = readRentals();

  if (filters.status) {
    rentals = rentals.filter(rental => rental.status === filters.status);
  }

  if (filters.carId) {
    rentals = rentals.filter(rental => rental.carId === filters.carId);
  }

  if (filters.from) {
    rentals = rentals.filter(rental => rental.from >= filters.from);
  }

  if (filters.to) {
    rentals = rentals.filter(rental => rental.to <= filters.to);
  }

  return rentals;
};

const getRentalById = (id) => {
  const rentals = readRentals();
  return rentals.find(rental => rental.id === id);
};

const createRental = (rentalData) => {
  const { carId, customer, from, to } = rentalData;
  
  // Check if car exists
  const car = carsService.getCarById(carId);
  if (!car) {
    const error = new Error('Car not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if car is available
  if (!car.available) {
    const error = new Error('Car is not available');
    error.statusCode = 409;
    throw error;
  }

  // Check for overlapping rentals
  const rentals = readRentals();
  const activeRentals = rentals.filter(r => r.carId === carId && r.status === 'active');
  
  for (const rental of activeRentals) {
    if (overlaps(from, to, rental.from, rental.to)) {
      const error = new Error('Car is already rented for the selected dates');
      error.statusCode = 409;
      throw error;
    }
  }

  // Calculate pricing
  const days = calculateDays(from, to);
  const total = parseFloat((days * car.pricePerDay).toFixed(2));

  const newRental = {
    id: Date.now().toString(),
    carId,
    customer,
    from,
    to,
    days,
    dailyRate: car.pricePerDay,
    total,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  rentals.push(newRental);
  writeRentals(rentals);

  // Mark car as unavailable
  carsService.setCarAvailability(carId, false);

  return newRental;
};

const returnCar = (id) => {
  const rentals = readRentals();
  const rental = rentals.find(r => r.id === id);

  if (!rental) return null;

  if (rental.status !== 'active') {
    const error = new Error('Rental is not active');
    error.statusCode = 400;
    throw error;
  }

  rental.status = 'returned';
  rental.returnedAt = new Date().toISOString();
  writeRentals(rentals);

  // Mark car as available
  carsService.setCarAvailability(rental.carId, true);

  return rental;
};

const cancelRental = (id) => {
  const rentals = readRentals();
  const rental = rentals.find(r => r.id === id);

  if (!rental) return null;

  rental.status = 'cancelled';
  rental.cancelledAt = new Date().toISOString();
  writeRentals(rentals);

  // Mark car as available if it was active
  if (rental.status === 'active') {
    carsService.setCarAvailability(rental.carId, true);
  }

  return rental;
};

module.exports = {
  getFilteredRentals,
  getRentalById,
  createRental,
  returnCar,
  cancelRental
};