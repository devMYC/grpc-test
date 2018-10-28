'use strict'

const { join } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {

  entry: join(__dirname, 'client-web.js'),

  output: {
    path: join(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  mode: 'development',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|vendors/,
        use: 'babel-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.ENVOY_CONTAINER_IP': JSON.stringify(process.env.ENVOY_CONTAINER_IP),
    }),
    new HtmlWebpackPlugin({ template: join(__dirname, 'index.html') }),
  ],

}
