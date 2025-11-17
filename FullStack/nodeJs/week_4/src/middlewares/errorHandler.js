function errorHandler(err, req, res, next) {
  // console.error('Erreur non gérée:', err);
  res.status(err.status || 500).json({ status: 'error', message: err.message || 'Erreur interne du serveur' });
}
module.exports = errorHandler;
