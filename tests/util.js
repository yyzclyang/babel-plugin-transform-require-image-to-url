const path = require('path');
const { transformFileSync } = require('@babel/core');

const plugin = path.join(path.resolve(__dirname, '..', 'src'), 'index.js');

const transformCode = (file, config = {}) => {
  const babelOptions = {
    babelrc: false,
    presets: [],
    plugins: [[plugin, config]]
  };
  return transformFileSync(file, babelOptions);
};

function getFixtures(name) {
  return path.resolve(__dirname, 'fixtures', name);
}

module.exports = { transformCode, getFixtures };
