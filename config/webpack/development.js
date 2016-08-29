const webpack = require('webpack');
const merge = require('webpack-merge');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const config = require('../');
const webpackConfig = require('./_base');

const devServer = {
  contentBase: config.get('dir_src'),
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
  },
  publicPath: webpackConfig.output.publicPath,
};

module.exports = merge(webpackConfig, {
  entry: {
    bundle: [
      'babel-polyfill',
      'webpack-hot-middleware/client?reload=true',
      'react-hot-loader/patch',
      ...webpackConfig.entry.bundle,
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    ...webpackConfig.plugins,
  ],
  devServer,
});
