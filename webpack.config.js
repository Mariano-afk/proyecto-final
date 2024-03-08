const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            title: '3Dteca',
            heading: '',
        }),
        new VueLoaderPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            
            {test: /\.(png|jpeg|jpg|gif)$/i,
                loader: 'file-loader',
                options:{
                    name:'assets/img/[name].[ext]'
                }
            },

            {test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options:{
                    name: '[name].[ext]',
                    outputPath: 'fonts/'

                }
            },
            {test: /\.(stl)$/,
                loader: 'url-loader',
            },
            
            
        ],
    },
}
