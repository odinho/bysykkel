const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    https: true,
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  module: {
    rules: [
      {test: /.css$/, use: ['style-loader', 'css-loader']},
    ],
  },
}
