const packageJson = require('../../package.json');

const getInfo = (req, res) => {
  const info = {
        name: packageJson.name,
        version: packageJson.version,
        date: new Date().toDateString()
    };
  res.json(info);
};

module.exports = {
  getInfo
};
