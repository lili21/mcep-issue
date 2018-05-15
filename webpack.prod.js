const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssPlugin = require('mini-css-extract-plugin')

const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name]-[contenthash].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name;
      }

      // eslint-disable-next-line no-underscore-dangle
      return [...chunk._modules]
        .map(m => path.relative(
          m.context,
          m.userRequest.substring(0, m.userRequest.lastIndexOf('.')),
        ))
        .join('_');
    }),
    new MiniCssPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css'
    })
  ]
})
