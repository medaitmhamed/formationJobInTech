const fs = require("node:fs");
const path = require("node:path");
// lire le contenu de dossier courant
fs.readdir(__dirname, (err, files) => {
  if (err) {
    return console.error("Erreur :", err);
  }
  // afficher la liste des fichiers avec leur date de création
  files.forEach((f) => {
    const stats = fs.statSync(path.join(__dirname, f));
    console.log(`${f} - créé le : ${stats.birthtime}`);
  });
});

