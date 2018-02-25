const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = require('./paths');

module.exports = {
  entry: {
    index: paths.indexJs,
  },
  output: {
    filename: '[name].js',
    path: paths.dist,
    library: 'extension',
    libraryTarget: 'var',
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js)$/,
        include: paths.src,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.(js)$/,
        exclude: paths.nodeModules,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: require('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.src,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([paths.dist], {
      root: paths.root,
      verbose: true,
      dry: false
    }),
    new CopyWebpackPlugin([
      {
        context: paths.root,
        from: paths.manifestJson,
        to: paths.dist,
      },
    ]),
    new CaseSensitivePathsPlugin(),
  ],
};
