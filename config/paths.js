'use strict';

const path = require('path');
const fs = require('fs');

const rootDirectory = fs.realpathSync(process.cwd());
const resolveLib = relativePath => path.resolve(rootDirectory, relativePath);

module.exports = {
  root: rootDirectory,
  src: resolveLib('src'),
  nodeModules: resolveLib('node_modules'),
  indexJs: resolveLib('src/index.js'),
  manifestJson: resolveLib('src/manifest.json'),
  dist: resolveLib('dist'),
};
