const os = require("node:os");

console.log("plateforme: ", os.platform()); //kay3tina l'OS li katkhdem fih l'application
console.log("version: ", os.release()); //kay3tina version dyal l'OS
console.log("Architecture: ", os.arch()); //kay3tina architecture dyal l'OS x86, arm, etc.
console.log("CPU: ", os.cpus()); //kay3tina l'information 3la les CPUs
// exemple :
//  {
//     model: '12th Gen Intel(R) Core(TM) i5-1235U',
//     speed: 2496,
//     times: {
//       user: 10861578,
//       nice: 0,
//       sys: 12091765,
//       idle: 172731984,
//       irq: 2671531
//     }
//   },
console.log("Total Memory: ", os.totalmem()); //kay3tina total memory RAM
console.log("Free Memory: ", os.freemem()); //kay3tina free memory RAM
console.log("Uptime (en heures): ", (os.uptime() / 3600).toFixed(2)); //kay3tina uptime

// Discusssion
// 1 - Quelle est la différence entre os.platform() et os.arch() ?
//  os.platform() répond à : "Sur quel OS tourne l'application ?"
//  os.arch() répond à : "Quelle est l'architecture de l'OS ?"

// 2- À quoi pourrait servir cette information dans une application réelle (ex : tableau de bord système) ?
// Ces informations permettent de créer un tableau de bord système intelligent qui adapte son comportement selon
// - l'environnement d'exécution
// - optimise les performances en fonction du matériel disponible
// - fournit des alertes personnalisées pour la maintenance proactive.
