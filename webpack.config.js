const ExtractTextPlugin = require( 'extract-text-webpack-plugin' )
const resolve = file => path.resolve( __dirname, file )
const { lstatSync, readdirSync } = require('fs')
const webpack = require( 'webpack' )
const path = require( 'path' )

const isDirectory = o => lstatSync(o.path).isDirectory()
const getDirectories = source => {
    return readdirSync(source).map(name => ({ path: path.join(source, name), name })).filter(isDirectory)
}

const install = null

const configs = getDirectories(resolve('src')).map(o => {

    // Get path to first .vue template in directory
    const componentPath = o.path + '/' + (readdirSync(o.path).filter(f => f.includes('.vue')).shift())

    return {
        entry: componentPath,
        output: {
            path: resolve( `dist/${ o.name }` ),
            filename: `index.js`,
            library: 'fh-components',
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            'scss': 'vue-style-loader!css-loader!sass-loader'
                        },
                        extractCSS: false,
                        preserveWhitespace: false,
                        postcss: [
                            require('autoprefixer')({
                                browsers: ['last 5 versions']
                            })
                        ]
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader?removeSVGTagAttrs=false'
                },
                {
                    test: /\.(png|woff|woff2|eot|ttf)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[name].[ext]?[hash]'
                    }
                },
                {
                    test: /\.css$/,
                    use: 'vue-style-loader'
                }
            ]
        }
    }
})

module.exports = configs
