const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = ext => `[name].${ext}`;

const optimization = () => {
  const configObj = {};

  if (isProd) {
    configObj.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ];
  }

  return configObj;
};

const plugins = () => {
  const basePlugins = [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: './index.html',
      minify: false,
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: `./css/${filename('css')}`
    }),
    new StylelintPlugin()
  ];

  if (isProd) {
    basePlugins.push(
      new CleanWebpackPlugin()
    )
  }

  return basePlugins;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './js/main.js',
  target: 'web',
  output: {
    filename: `./js/${filename('js')}`,
    path: path.resolve(__dirname, 'app'),
    publicPath: '',
    assetModuleFilename: '[path][name][ext]'
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'app'),
    open: true,
    compress: true,
    hot: true,
    port: 3000,
  },
  optimization: optimization(),
  devtool: isProd ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
              sources: {
                list: [
                  '...',
                  {
                    tag: 'div',
                    attribute: 'data-image',
                    type: 'src'
                  }
                ]
              }
            }
          }
        ]
      },
      // {
      //   test: /\.css$/i,
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader,
      //       options: {
      //         hmr: isDev
      //       },
      //     },
      //     'css-loader'
      //   ],
      // },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
        type: 'asset',
        generator: {
          filename: '[path][name][ext]'
        },
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              severityError: 'warning',
              minimizerOptions: {
                plugins: ['gifsicle', 'mozjpeg', 'pngquant'],
              },
            },
          },
        ],
      },
      {
        test: /\.(?:|eot|ttf|woff|woff2)$/,
        type: 'asset'
      }
    ]
  },
  plugins: plugins(),
};
