/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const HWP = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name].fonts.css');
const extractSCSS = new ExtractTextPlugin('[name].styles.css');

const SRC_DIR = path.resolve(__dirname, './src/bootstrap/index.js');
const BUILD_DIR = path.resolve(__dirname, '/dist');
const HWP_DIR = path.resolve(__dirname, './public/index.html');

module.exports = {
    entry: {
        index: [SRC_DIR],
    },
    output: {
        filename: 'build.js',
        path: BUILD_DIR,
    },
    devServer: {
		port: 3000,
    },
    node: {
        fs: 'empty',
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: [
                        "@babel/preset-env",
                        "@babel/preset-react",
                    ],
                },
            },
        }, {
            test: /\.html$/,
            loader: 'html-loader',
        }, {
            test: /\.(scss)$/,
            use: ['css-hot-loader'].concat(extractSCSS.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: { alias: { '../img': '../public/img' } },
                }, {
                    loader: 'sass-loader',
                }],
            })),
        }, {
            test: /\.css$/,
            use: extractCSS.extract({
                fallback: 'style-loader',
                use: 'css-loader',
            }),
        }, {
            test: /\.(png|jpg|jpeg|gif|ico)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: './img/[name].[hash].[ext]'
                },
            }],
        }, {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader',
            options: {
                name: './fonts/[name].[hash].[ext]',
            },
        }],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        extractCSS,
        extractSCSS,
        new HWP({
            inject: true,
            template: HWP_DIR,
        }),
        new CopyWebpackPlugin([
            { from: './public/img', to: 'img' },
            { from: './public/js/', to: '' },
            { from: './public/mock', to: 'mock' },
          ],
          { copyUnmodified: false },
        )
    ],
    optimization: {
        minimizer: [
          // we specify a custom UglifyJsPlugin here to get source maps in production
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
              compress: false,
              ecma: 6,
              mangle: true
            },
            sourceMap: true
          })
        ],
    },
}