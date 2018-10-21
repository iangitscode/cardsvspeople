const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');

module.exports = env => ({
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve('.', 'public_html', 'dist'),
    publicPath: 'dist/',
    filename: 'index.min.js',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.(png|svg|gif|jpe?g)$/, loader: 'file-loader?name=images/[hash].[ext]!img-loader' },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader?modules=true&minimize=true!postcss-loader',
      },
    ],
  },
  devtool: 'cheap-eval-source-map',
  plugins: env === 'production' ? [new UglifyJSPlugin()] : []
});
