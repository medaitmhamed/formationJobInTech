const express = require('express');
const router = express.Router();
const { getInfo } = require('../controllers/apiController');

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the my API app' });
});

router.get('/info', getInfo);

module.exports = router;
