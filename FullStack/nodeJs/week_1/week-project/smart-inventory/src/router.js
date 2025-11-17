const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require("./controllers/productController");

// Home route
router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Health route
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Get all products (from MongoDB)
router.get('/api/products', getProducts);

// Get product by ID (from MongoDB)
router.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by SKU (from MongoDB)
router.get('/api/products/sku/:sku', async (req, res) => {
  try {
    const product = await Product.findOne({ sku: req.params.sku });
    if (!product)
      return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/orders', (req, res) => {
  res.json(['order1', 'order2', 'order3']);
});

router.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    product: 'Sample Product',
    quantity: 1,
  });
});

module.exports = { router };
