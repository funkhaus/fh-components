require('jsdom-global')()
require('babel-register')

const path = require( 'path' )
const resolve = file => path.resolve( __dirname, file )
const { lstatSync, readdirSync } = require('fs')

const tests = readdirSync(__dirname).forEach(fileName => {
    if ( fileName == 'index.js' ) return
    require(`./${ fileName }`)
})
