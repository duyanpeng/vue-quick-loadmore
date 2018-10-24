const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackBaseConfig = require('./webpack.base.config.js');
const WebpackMerge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals');

module.exports = WebpackMerge(WebpackBaseConfig,{
    entry:  './index.js',
    mode:'production',
    output:{
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
    ],
    module:{
        rules:[
            {
                test: /\.css$/, use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader:'postcss-loader'
                    }
                ]
            },
            {
                test: /\.less$/, use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader:'postcss-loader'
                    },{
                        loader:'less-loader'
                    }
                ]
            }
        ]
    },
    devServer: {
        overlay: true,
        disableHostCheck: true,
        port: 9000
    },
    devtool: 'inline-cheap-module-source-map',
    // target: 'node',
    // externals: [nodeExternals()]
})
