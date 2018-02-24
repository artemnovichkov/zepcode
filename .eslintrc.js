const path = require('path');
module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'airbnb-base',
    'prettier',
  ],
  'plugins': [
    'prettier',
  ],
  'rules': {
    'prettier/prettier': ['error', {
      'singleQuote': true,
      'trailingComma': 'es5'
    }],
  },
  'parser': 'babel-eslint',
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': path.join(__dirname, 'config/webpack.config.dev.js')
      }
    }
  }
}
