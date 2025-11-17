const resources = require("../services/ressourcesService");

// Obtenir tous les ressources
exports.getAllResources = (req, res) => {
  const allResources = resources.getAll();
  res.json(allResources);
};
// Obtenir une ressource par ID
exports.getResourceById = (req, res) => {
  const resource = resources.getById(req.params.id);
  if (!resource) return res.status(404).send("Resource not found");
  res.json(resource);
};
// Ajouter une nouvelle ressource
exports.addResource = (req, res) => {
  const newResource = resources.add(req.body);
  res.status(201).json(newResource);
};
// Mettre à jour une ressource
exports.updateResource = (req, res) => {
  const updatedResource = resources.update(req.params.id, req.body);
  if (!updatedResource) return res.status(404).send("Resource not found");
  res.json(updatedResource);
};
// Supprimer une ressource
exports.deleteResource = (req, res) => {
  const deleted = resources.delete(req.params.id);
  if (!deleted) return res.status(404).send("Resource not found");
  res.status(204).send();
};
