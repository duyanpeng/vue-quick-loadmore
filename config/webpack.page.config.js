const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackBaseConfig = require('./webpack.base.config.js');
const WebpackMerge = require('webpack-merge')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = WebpackMerge(WebpackBaseConfig, {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: '[name].[chunkhash].js',
    },
    mode: 'production',
    module:{
        rules:[
            {
                test: /\.css$/, 
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader","postcss-loader"]
                  })
                // use: [
                //     { loader: 'style-loader' },
                //     {
                //         loader: 'css-loader',
                //     },
                //     {
                //         loader:'postcss-loader'
                //     }
                // ]
            },
            {
                test: /\.less$/, 
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader","postcss-loader","less-loader"]
                  })
                // use: [
                //     { loader: 'style-loader' },
                //     {
                //         loader: 'css-loader',
                //     },
                //     {
                //         loader:'postcss-loader'
                //     },{
                //         loader:'less-loader'
                //     }
                // ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['build']),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        
    ],
    optimization: {
        splitChunks: {
            // chunks:'all'
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
})
