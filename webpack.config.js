/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const TerserPlugin = require("terser-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const ENV = require('dotenv-webpack');


module.exports = (env, argv) => {

    console.log(argv, env);

    const prod = argv.mode === 'production';
    const filename = '[contenthash:6]'; //prod ? '[name].[contenthash:6]' : '[name]/app';
    const BASE_URL = process.env.BASE_URL ?? '/';

    return {
        mode: 'development',
        target: 'web',
        devtool: prod ? false : 'source-map',

        output: {
            path: path.join(__dirname, './dist'),
            //filename: '[name].[hash:8].js',
            filename: filename + '.js',
            publicPath: BASE_URL,
            clean: prod,
        },
        entry: "./src/index.tsx",
        // externals: ['crypto'],
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react",
                                "@babel/preset-typescript",
                            ],
                        },
                    },

                },

                {

                    test: /\.s?[ac]ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                }

            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],

            // npm install --save-dev react-app-rewired crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process
            // fallback: {
            //     assert: require.resolve('assert'),
            //     buffer: require.resolve('buffer'),
            //     // console: require.resolve('console-browserify'),
            //     // constants: require.resolve('constants-browserify'),
            //     crypto: require.resolve('crypto-browserify'),
            //     // domain: require.resolve('domain-browser'),
            //     // events: require.resolve('events'),
            //     http: require.resolve('stream-http'),
            //     https: require.resolve('https-browserify'),
            //     os: require.resolve('os-browserify/browser'),
            //     // path: require.resolve('path-browserify'),
            //     // punycode: require.resolve('punycode'),
            //     // process: require.resolve('process/browser'),
            //     // querystring: require.resolve('querystring-es3'),
            //     stream: require.resolve('stream-browserify'),
            //     // string_decoder: require.resolve('string_decoder'),
            //     // sys: require.resolve('util'),
            //     // timers: require.resolve('timers-browserify'),
            //     // tty: require.resolve('tty-browserify'),
            //     url: require.resolve('url'),
            //     // util: require.resolve('util'),
            //     // vm: require.resolve('vm-browserify'),
            //     // zlib: require.resolve('browserify-zlib'),
            // },
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "src/index.html",
            }),
            new webpack.HotModuleReplacementPlugin(),

            new webpack.EnvironmentPlugin({
                DEBUG: !prod,
            }),
            new ENV({
                path: `.env.${argv.mode}`,
                // safe: true
            }),

            // new NodePolyfillPlugin(),

            new MiniCssExtractPlugin({
                filename: filename + '.css',
            }),

            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 2,
            }),
            new webpack.ProvidePlugin({
                "React": "react",
            }),
        ],

        devServer: {
            // static: path.join(__dirname, "dist"),
            // historyApiFallback: true,
            port: 8080,
            // open: true,
            historyApiFallback: {
                index: '/index.html' // spa
            },
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                },
            },
            hot: true
        },

        optimization: {
            minimize: prod,
            // runtimeChunk: true,
            // runtimeChunk: 'single',
            // splitChunks: {
            //     cacheGroups: {
            //         // commons: {
            //         //     test: /[\\/]node_modules[\\/]/,
            //         //     name: 'lib',
            //         //     chunks: 'initial',
            //         // },
            //         // defaultVendors: {
            //         //     idHint: 'vendors',
            //         // },
            //         defaultVendors: {
            //             filename: filename
            //         },
            //     },
            // },
            // splitChunks: {
            //     chunks: 'all',
            // },

            // splitChunks: {
            //     cacheGroups: {
            //         vendor: {
            //             test: /[\\/]node_modules[\\/]/,
            //             name: 'vendors',
            //             chunks: 'all'
            //         }
            //     }
            // },            

            // splitChunks: {
            //     chunks: 'async',
            //     cacheGroups: {
            //         default: {
            //             minChunks: 2,
            //             priority: -20,
            //             reuseExistingChunk: true,
            //         },
            //         vendors: {
            //             test: /[\\/]node_modules[\\/]/,
            //             priority: -10
            //         }
            //     },
            // },

            // splitChunks: {
            //     cacheGroups: {
            //         default: false,
            //         vendors: false,

            //         web3: {
            //             test: /@web3/,
            //             name: "web3",
            //             priority: 20,
            //         },
            //         // vendor chunk
            //         vendor: {
            //             // sync + async chunks
            //             chunks: 'all',
            //             // import file path containing node_modules
            //             test: /node_modules/
            //         }
            //     }
            // },


            // splitChunks: {
            //     cacheGroups: {
            //         // defaultVendors: {
            //         //     test: /[\\/]node_modules[\\/](react|react-dom|web3)[\\/]/,
            //         //     name: 'vendor',
            //         //     chunks: 'all',
            //         // },

            //         polyfill: {
            //             test: /[\\/]node_modules[\\/](assert|browserify-zlib|buffer|console-browserify|constants-browserify|crypto-browserify|domain-browser|events|filter-obj|https-browserify)[\\/]/,
            //             name: 'polyfill',
            //             chunks: 'all',
            //         },

            //         // vendor: {
            //         //     test: /[\\/]node_modules[\\/](react|react-dom|web3)[\\/]/,
            //         //     name: 'vendor',
            //         //     chunks: 'all',
            //         // },
            //     },
            // },

            minimizer: [
                new TerserPlugin(),
                new CssMinimizerPlugin()
            ],
        },

        performance: { hints: prod ? false : 'warning' },
        stats: {
            chunks: true,
            chunkRelations: true
        },

    }
};
