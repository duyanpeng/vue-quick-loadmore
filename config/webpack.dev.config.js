const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackBaseConfig = require('./webpack.base.config.js');
const WebpackMerge = require('webpack-merge')

module.exports = WebpackMerge(WebpackBaseConfig,{
    entry:  './index.js',
    mode:'development',
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
    }
})
