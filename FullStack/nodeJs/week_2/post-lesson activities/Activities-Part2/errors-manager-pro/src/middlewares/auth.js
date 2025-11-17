module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token !== "1234") {
    return res.status(403).json({
      error: "Accès refusé",
      reason: "Token invalide ou horaire interdit",
    });
  }

  next();
};