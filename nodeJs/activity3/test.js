console.log("__filename:", __filename);
console.log("__dirname:", __dirname);
console.log("module:", module);
console.log("exports === module.exports:", exports === module.exports);

exports.direSalut = () => console.log("Salut !");
console.log("module.exports après modification:", module.exports);