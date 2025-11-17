const fs = require('fs');
const path = require('path');

const carsFilePath = path.join(__dirname, '../data/cars.json');

const readCars = () => {
  try {
    const data = fs.readFileSync(carsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeCars = (cars) => {
  fs.writeFileSync(carsFilePath, JSON.stringify(cars, null, 2));
};

const getFilteredCars = (filters) => {
  let cars = readCars();

  if (filters.category) {
    cars = cars.filter(car => car.category === filters.category);
  }

  if (filters.available !== undefined) {
    const isAvailable = filters.available === 'true';
    cars = cars.filter(car => car.available === isAvailable);
  }

  if (filters.minPrice) {
    cars = cars.filter(car => car.pricePerDay >= parseFloat(filters.minPrice));
  }

  if (filters.maxPrice) {
    cars = cars.filter(car => car.pricePerDay <= parseFloat(filters.maxPrice));
  }

  if (filters.q) {
    const query = filters.q.toLowerCase();
    cars = cars.filter(car => 
      car.plate.toLowerCase().includes(query) || 
      car.model.toLowerCase().includes(query)
    );
  }

  return cars;
};

const getCarById = (id) => {
  const cars = readCars();
  return cars.find(car => car.id === id);
};

const createCar = (carData) => {
  const cars = readCars();
  
  // Check for duplicate plate
  if (cars.some(car => car.plate === carData.plate)) {
    const error = new Error('Plate number already exists');
    error.statusCode = 409;
    throw error;
  }

  const newCar = {
    id: Date.now().toString(),
    ...carData,
    available: true,
    createdAt: new Date().toISOString()
  };

  cars.push(newCar);
  writeCars(cars);
  return newCar;
};

const updateCar = (id, updates) => {
  const cars = readCars();
  const index = cars.findIndex(car => car.id === id);

  if (index === -1) return null;

  cars[index] = { ...cars[index], ...updates, id };
  writeCars(cars);
  return cars[index];
};

const deleteCar = (id) => {
  const cars = readCars();
  const index = cars.findIndex(car => car.id === id);

  if (index === -1) return false;

  cars.splice(index, 1);
  writeCars(cars);
  return true;
};

const setCarAvailability = (carId, available) => {
  const cars = readCars();
  const car = cars.find(c => c.id === carId);
  
  if (car) {
    car.available = available;
    writeCars(cars);
  }
};

module.exports = {
  getFilteredCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  setCarAvailability
};