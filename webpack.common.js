const path = require('path')
const tsImportPluginFactory = require('ts-import-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const antd = require('./src/themes/antd');

module.exports = {
    entry: [
        './src/index.tsx'
    ],
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ExtractTextPlugin({
            filename: `[name].[hash:8].css`,
            allChunks: true,
        }),
    ],
    output: {
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                                before: [tsImportPluginFactory({
                                    libraryDirectory: 'es',
                                    libraryName: 'antd',
                                    style: true,
                                })]
                            }),
                            compilerOptions: {
                                module: 'es2015'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: /^node_modules$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: false,
                            }
                        },
                    ]
                })
            },
            {
                // 项目的样式, 开启css modules
                test: /\.less$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: "[name]__[local]___[hash:base64:5]",
                                sourceMap: true,
                                minimize: true,
                                exportOnlyLocals: true,
                            }
                        },
                        {
                            loader: 'less-loader',
                        }
                    ]
                })
            },
            {
                // antd styles, without css modules
                test: /\.less$/,
                include: [
                    path.resolve(__dirname, 'node_modules')
                ],
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true,
                                modifyVars: antd
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ],
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models/'),
            '@definitions': path.resolve(__dirname, 'src/definitions/'),
            '@components': path.resolve(__dirname, 'src/components/'),
            '@services': path.resolve(__dirname, 'src/services/'),
            '@config': path.resolve(__dirname, 'src/config/'),
            '@themes': path.resolve(__dirname, 'src/themes/'),
            '@utils': path.resolve(__dirname, 'src/utils/'),
        }
    },
};
