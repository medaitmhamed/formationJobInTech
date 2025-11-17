const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../validators/validate');
const auth = require('../validators/auth.validator');

router.post('/register',validate(auth.registerSchema), authController.register);
router.post('/login',validate(auth.loginSchema), authController.login);

module.exports = router;