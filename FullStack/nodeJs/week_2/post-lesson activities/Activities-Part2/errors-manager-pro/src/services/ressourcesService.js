const ressources = require('../../data/ressources');

// Obtenir tous les ressources
exports.getAll = () => {
  return ressources;
};

// Obtenir une ressource par ID
exports.getById = (id) => {
  // const ressources = JSON.stringify(ressources);
  const resource = ressources.find(r => r.id == id);
  console.log(resource);
  
  return resource;
};

// Ajouter une nouvelle ressource
exports.add = (resource) => {
  ressources.push(resource);
  return resource;
};

// Mettre à jour une ressource
exports.update = (id, resource) => {
  const index = ressources.findIndex(r => r.id === id);
  if (index === -1) return null;
  ressources[index] = { ...ressources[index], ...resource };
  return ressources[index];
};

// Supprimer une ressource
exports.delete = (id) => {
  const index = ressources.findIndex(r => r.id === id);
  if (index === -1) return null;
  ressources.splice(index, 1);
  return true;
};
    