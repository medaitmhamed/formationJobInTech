const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.startTime = Date.now();
  next();
});

app.get("/ping", (req, res) => {
  const duration = Date.now() - res.startTime;
  res.json({ message: "pong", duration: `${duration}ms` });
});

app.get("/", (req, res) => {
  res.send("Bienvenue sur mon premier serveur Express !");
});

app.get("/api/products", (req, res) => {
  const products = [
    { id: 1, name: "Produit 1", price: 100 },
    { id: 2, name: "Produit 2", price: 200 },
    { id: 3, name: "Produit 3", price: 300 },
  ];
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  res.json({ msg: `Détails du produit avec l'ID ${req.params.id}` });
});

app.get("/api/crash", (req, res, next) => {
  const err = new Error("Erreur simulée");
  next(err);
});

app.use((err, req, res, next) => {
  console.error("Erreur detectée :", err.message);
  res.status(500).json({ error: err.message });
});

app.get("/api/products", (req, res) => {
  const data = FileSystem.readFileSync("products.json", "utf-8");
  const products = JSON.parse(data);
  res.json(products);
});

app.listen(3000, () => {
  console.log("Le serveur en écoute sur http://localhost:3000");
});

// Activité 1:
/*
dans mon serveur Node.js natif je dois tout faire manuellement :
- Gérer les routes (if (req.url === '/'))
- Lire le corps (body) des requêtes (avec req.on('data'))
- Gérer les en-têtes, statuts HTTP, JSON, etc.
- Aucun middleware, aucune aide pour le parsing ou la sécurité.
*/

/*
Express gère automatiquement :
- Le routage : plus besoin de if/else sur req.url
- Le parsing du corps (body) : JSON, form-data, etc. via express.json() ou express.urlencoded()
- Les en-têtes et statuts HTTP : res.json(), res.status(), etc.
- Les middlewares : pour la sécurité, les logs, le CORS, etc.
- La gestion des erreurs : simplifiée
- Les fichiers statiques : via app.use(express.static('public'))
*/



// Activité 2:

/*
Le JSON est un format d'échange de données léger et standardisé, utilisé pour communiquer entre le serveur et le client.
il est :
- Lisible par l'humain et facile à comprendre.
- Facilement exploitable par le JavaScript.
- Structure claire key-value.
*/

/*
Parce qu'en architecture REST chaque ressource doit avoir une URL unique (endppoint).
*/



// Activité 3:

/*
next() est une fonction qui permet de passer le contrôle au middleware suivant dans la chaîne.
*/

/*
Un middleware global s'applique à toutes les routes, tandis qu'un middleware spécifique à une route ne s'applique qu'à cette route particulière.
*/

/*
Les middlewares sont importants car :
- Ils permettent d'ajouter des fonctionnalités transversales (logs, sécurité, parsing) de manière centralisée.
- Ils améliorent la maintenabilité et la lisibilité du code. 
*/



// Activité 4:

/*
le middleware d'erreur doit-il être placé en dernier parce qu'il doit capturer toutes les erreurs générées par les middlewares et routes précédents.
*/

/*
La différence entre throw new Error() et next(err) est que
throw new Error() génère une erreur qui peut être capturée par un bloc try/catch, tandis que next(err) passe l'erreur au middleware d'erreur suivant.
*/



// Activité 5:

/*
La différence entre servir un fichier statique et lire un fichier JSON est que :
Servir un fichier statique consiste à envoyer des fichiers tels que HTML, CSS, JS directement au client
tandis que lire un fichier JSON implique de charger les données du fichier, de les parser et de les envoyer sous forme de réponse JSON.
*/

/*
readFileSync n’est pas recommandé en production parce que 
fs.readFileSync bloque l'exécution du code jusqu'à ce que le fichier soit lu, ce qui peut entraîner des problèmes de performance et de réactivité En production
il est préférable d'utiliser des méthodes asynchrones.
*/

/*
On pourrait utiliser fs.promises.readFile pour lire le fichier de manière asynchrone et gérer les promesses avec async/await ou .then/.catch.
*/
