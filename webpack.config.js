const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default

const PAGES = [
    'index',
]

module.exports = {
    mode: 'production',
    entry: [
        './src/css/index.css',
        './src/index.ts',
    ],
    performance: {
        maxAssetSize: 2048000,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dst'),
        filename: 'bundle.js',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'static' },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'bundle.css',
        }),
        new HTMLInlineCSSWebpackPlugin({
            replace: {
                position: 'before',
                target: '<link rel="manifest"',
                removeTarget: false,
            }
        }),
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `./src/${page}.ejs`,
            filename: `${page}.html`,
            inject: false,
            scriptLoading: 'blocking',
            minify: true,
            hash: true,
        })),
    ],
    devServer: {
        host: '127.0.0.1',
        port: 49151,
        static: {
            directory: path.join(__dirname, 'static'),
        },
    },
}
