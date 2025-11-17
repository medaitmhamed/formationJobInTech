const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { email, password, role } = req.body;
    const result = await authService.register({ email, password, role });

    res.status(201).json({
      status: 'success',
      data: result.user,
      token: result.token,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    res.json({
      status: 'success',
      data: result.user,
      token: result.token,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};