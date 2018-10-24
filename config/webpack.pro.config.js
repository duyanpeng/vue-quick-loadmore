const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackBaseConfig = require('./webpack.base.config.js');
const WebpackMerge = require('webpack-merge')

module.exports = WebpackMerge(WebpackBaseConfig,{
    entry:'./src/index.js',
    output:{
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        library:'[name].js',
        libraryTarget:'umd',
    },
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
            },
        ]
    },
    plugins:[
        new CleanWebpackPlugin(['dist'])
    ],
    mode:'production',
})
