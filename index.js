const { lstatSync, readdirSync } = require('fs')
const path = require( 'path' )
const resolve = file => path.resolve( __dirname, file )
const _camelCase = require('lodash/camelCase')

const isDirectory = o => lstatSync(o.path).isDirectory()
const components = readdirSync(resolve('dist')).map(name => {
    return { path: path.join(source, name), name  }
}).filter(isDirectory).reduce((acc, o) => {
    acc[_camelCase(o.name)] = require(o.path).default
    return acc
}, {})

module.exports = components
