const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development', // or 'production' when ready
  entry: './background.js', // your main JS file
  output: {
    filename: 'background.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new Dotenv()
  ]
};
