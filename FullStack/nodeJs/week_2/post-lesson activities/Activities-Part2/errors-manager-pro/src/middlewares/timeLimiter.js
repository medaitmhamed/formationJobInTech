module.exports = (req, res, next) => {
  const hour = new Date().getHours();

  if (hour >= 22 || hour < 6) {
    return res.status(403).json({
      error: "Accès refusé",
      reason: "Token invalide ou horaire interdit",
    });
  }
  next();
};
