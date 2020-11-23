const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const pkg = require('./package.json');

module.exports = {

  module: {
    rules: [

      // JavaScript
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-transform-runtime'],
            presets: ['@babel/preset-env'],
          },
        },
      },

      // Vue.js
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },

      // CSS / SCSS
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'resolve-url-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },

      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: { filename: 'fonts/[name][ext]' },
      },

      // Images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: { filename: 'images/[name][ext]' },
      },

    ],
  },

  plugins: [

    // Clean assets directory
    new CleanWebpackPlugin(),

    // Define useful constants
    new DefinePlugin({
      DESCRIPTION: JSON.stringify(pkg.description),
      VERSION: JSON.stringify(pkg.version),
    }),

    // Extract styles to a single CSS file
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),

    // Vue.js
    new VueLoaderPlugin(),

  ],

  resolveLoader: {
    modules: ['node_modules', resolve(__dirname, 'node_modules')]
  },

  devtool: process.argv.includes('development') && 'source-map',

  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },

  stats: {
    all: false,
    assets: true,
    errors: true,
    timings: true,
    warnings: true,
  },

};
