const fitToParent = require('./')
const tap = require('tap')

const [w, h] = fitToParent({
    ratio: 1,
    parentWidth: 1920,
    parentHeight: 1080
})

tap.equal(w, 1080, 'Properly calculates width.')
tap.equal(h, 1080, 'Properly calculates height.')

const [w1, h1] = fitToParent({
    elWidth: 100,
    elHeight: 100,
    parentWidth: 1920,
    parentHeight: 1080,
    upres: false
})

tap.equal(w1, 100, 'Width is restricted when upres is false.')
tap.equal(h1, 100, 'Height is restricted when upres is false.')

tap.test('Callback receives values', test => {
    fitToParent({
        ratio: 1,
        parentWidth: 1920,
        parentHeight: 1080,
        callback ([cw, ch]) {
            test.equal(cw, 1080, 'Callback gets width.')
            test.equal(ch, 1080, 'Callback gets height.')
            return test.end()
        }
    })
})

tap.throws(() => {
    return fitToParent({
        ratio: 1
    })
}, 'Throws an error if no dimensions or elements are provided.')
