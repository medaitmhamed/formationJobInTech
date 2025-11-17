const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'une erreur est survenue' });
};

module.exports = errorHandler;
