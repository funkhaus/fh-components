/*!
* jQuery fitToParent; version: 1.3.2
* https://github.com/funkhaus/fitToParent
*/

const fitToParent = (ops = {}) => {

    // if DOM node was passed in, treat as el. Otherwise get from ops
    const el = ops.nodeName ? ops : ops.element

    // if an element has been provided
    let sizeParent = {}, elHeight, elWidth
    if ( el ){

        // set el dimensions with fallbacks
        elHeight = el.getAttribute('height') || el.style.height || el.offsetHeight
        elWidth = el.getAttribute('width') || el.style.width || el.offsetWidth

        // find parent to size off of
        const closestSizeParent = (el => {
            do if ( el && el.classList && el.classList.contains('size-parent') ) return el
            while (el = el && el.parentNode)
        })(el)
        sizeParent = closestSizeParent || el.parentNode
    }

    // merge w/ defaults
    const settings = {
        heightOffset: 0,
        widthOffset: 0,
        parentHeight: sizeParent.offsetHeight,
        parentWidth: sizeParent.offsetWidth,
        callback: null,
        ratio: null,
        upres: true,
        elHeight,
        elWidth,
        ...ops
    }

    // set stage
    const stage = {
        height: settings.parentHeight - settings.heightOffset,
        width: settings.parentWidth - settings.widthOffset
    }

    // if upres is false, stage must not exceed el dimensions
    if ( !settings.upres ){
        stage.height = Math.min(stage.height, settings.elHeight)
        stage.width = Math.min(stage.width, settings.elWidth)
    }

    // Calculate aspect, lock to el if possible
    let aspect = settings.ratio
    if ( el && el.dataset['aspect'] ){
        aspect = aspect || el.dataset['aspect']
    } else {
        aspect = aspect || settings.elWidth / settings.elHeight
        if ( el ) el.dataset['aspect'] = aspect
    }

    if ( !settings.parentHeight || !settings.parentWidth || !aspect )
        throw new Error('Not enough info for fitToParent to calculate.')

    // set stage aspect ratio
    const stageAspect = stage.width / stage.height

    // Calc new width && height
    let newWidth, newHeight
    if (aspect > stageAspect) {
        newWidth = stage.width
        newHeight = (newWidth / aspect)
    } else {
        newHeight = stage.height
        newWidth = newHeight * aspect
    }

    // Set new size of element (if we have one)
    if ( el ){
        el.style.width = newWidth + 'px'
        el.style.height = newHeight + 'px'
    }

    // Fire callback if provided
    if (typeof(settings.callback) == 'function') {
        settings.callback.call(el, [newWidth, newHeight])
    }

    // return new dimensions
    return [newWidth, newHeight]
}

module.exports = fitToParent
