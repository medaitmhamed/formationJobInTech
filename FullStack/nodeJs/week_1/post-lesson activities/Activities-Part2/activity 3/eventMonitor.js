const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("utilisateurConnecte", (data) => {
  console.log(`Nouvelle connexion : ${data.nom} (${data.id})`);
});
emitter.emit("utilisateurConnecte", { id: 1, nom: "Med" });

// Discussion
// 1 - Que se passe-t-il si l’écouteur est enregistré après l’émission de l’événement ?
// L’écouteur ne sera pas appelé pour cet événement, car il a été émis avant que l’écouteur ne soit enregistré.
// 2 - Peut-on avoir plusieurs écouteurs pour un même événement ?
// Oui, on peut avoir plusieurs écouteurs pour un même événement. Tous les écouteurs enregistrés seront appelés dans l’ordre où ils ont été ajoutés lorsque l’événement est émis.
