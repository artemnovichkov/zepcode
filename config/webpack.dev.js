'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const paths = require('./paths');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  output: {
    pathinfo: true,
  },
  watch: true,
  watchOptions: {
    ignored: paths.nodeModules,
  },
  performance: {
    hints: false,
  },
});
