class AppError extends Error {
  constructor(message, statusCode, timestamp = new Date().toISOString()) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// errorHandler.js - Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  // Valeurs par défaut
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.timestamp = err.timestamp || new Date().toISOString();

  // Format de réponse standardisé
  const response = {
    status: err.status,
    message: err.message,
    code: err.statusCode,
    timestamp: err.timestamp
  };

  // En développement, ajouter la stack trace
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Envoyer la réponse
  res.status(err.statusCode).json(response);
};

module.exports = { AppError, errorHandler };