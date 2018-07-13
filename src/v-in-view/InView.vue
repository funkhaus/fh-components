<script>
import throttle from 'lodash/throttle'
import Vue from 'vue'

let height = 0
let top = 0
let bottom = 0
let width = 0
let left = 0
let right = 0

function setRect(el) {
    if (!el.getBoundingClientRect) {
        return
    }
    const rect = el.getBoundingClientRect()
    bottom = rect.bottom
    top = rect.top
    left = rect.left
    right = rect.right
}

function setHeight(el) {
    height = el.clientHeight || 0
}

function setWidth(el) {
    width = el.clientWidth || 0
}

function setClass(el, opts, runEvents = true) {
    // list of class names this directive might attach to the el
    const possibleVerticalClasses = [opts.aboveClass, opts.belowClass]
    const possibleHorizontalClasses = [opts.leftClass, opts.rightClass]

    // class names attached to the el by this directive
    const currentClassVertical =
        [...el.classList].find(className =>
            possibleVerticalClasses.includes(className)
        ) || ''
    const currentClassHorizontal =
        [...el.classList].find(className =>
            possibleHorizontalClasses.includes(className)
        ) || ''

    // new classes we'll be adding to the el
    let newClassVertical = currentClassVertical
    let newClassHorizontal = currentClassHorizontal

    // event types to register
    let eventType = []

    // we'll need to check both dimensions to see if we're in view
    let inViewVertical = false
    let inViewHorizontal = false

    // Vertical in-view status
    if (height && top + height <= 0) {
        newClassVertical = opts.aboveClass
        eventType.push('leave-view', 'above')
    } else if (top >= window.innerHeight) {
        newClassVertical = opts.belowClass
        eventType.push('leave-view', 'below')
    } else {
        newClassVertical = ''
        inViewVertical = true
        eventType.push('enter-view')

        if (currentClassVertical == opts.aboveClass) {
            eventType.push('above')
        } else {
            eventType.push('below')
        }
    }

    if (width && left + width <= 0) {
        newClassVertical = opts.leftClass
        eventType.push('leave-view', 'left')
    } else if (left >= window.innerWidth) {
        newClassVertical = opts.rightClass
        eventType.push('leave-view', 'right')
    } else {
        newClassHorizontal = ''
        inViewHorizontal = true
        eventType.push('enter-view')

        if (currentClassHorizontal == opts.leftClass) {
            eventType.push('left')
        } else {
            eventType.push('right')
        }
    }

    // Add vertical class if in view
    if (currentClassVertical != newClassVertical) {
        if (currentClassVertical) {
            el.classList.remove(currentClassVertical)
        }
        if (newClassVertical) {
            el.classList.add(newClassVertical)
        }

        // Fire events
        if (runEvents) {
            // enter events
            if (eventType.indexOf('enter-view') != -1) {
                if (opts.onEnter) {
                    opts.onEnter(el)
                }
                if (eventType.indexOf('above') != -1 && opts.onEnterAbove) {
                    opts.onEnterAbove(el)
                }
                if (eventType.indexOf('below') != -1 && opts.onEnterBelow) {
                    opts.onEnterBelow(el)
                }
            }

            // leave events
            if (eventType.indexOf('leave-view') != -1) {
                if (opts.onLeave) {
                    opts.onLeave(el)
                }
                if (eventType.indexOf('above') != -1 && opts.onLeaveAbove) {
                    opts.onLeaveAbove(el)
                }
                if (eventType.indexOf('below') != -1 && opts.onLeaveBelow) {
                    opts.onLeaveBelow(el)
                }
            }
        }
    }

    if (currentClassHorizontal != newClassHorizontal) {
        if (currentClassHorizontal) {
            el.classList.remove(currentClassHorizontal)
        }
        if (newClassHorizontal) {
            el.classList.add(newClassHorizontal)
        }

        // Fire events
        if (runEvents) {
            // enter events
            if (eventType.indexOf('enter-view') != -1) {
                if (opts.onEnter) {
                    opts.onEnter(el)
                }
                if (eventType.indexOf('left') != -1 && opts.onEnterLeft) {
                    opts.onEnterLeft(el)
                }
                if (eventType.indexOf('right') != -1 && opts.onEnterRight) {
                    opts.onEnterRight(el)
                }
            }

            // leave events
            if (eventType.indexOf('leave-view') != -1) {
                if (opts.onLeave) {
                    opts.onLeave(el)
                }
                if (eventType.indexOf('left') != -1 && opts.onLeaveLeft) {
                    opts.onLeaveLeft(el)
                }
                if (eventType.indexOf('right') != -1 && opts.onLeaveRight) {
                    opts.onLeaveRight(el)
                }
            }
        }
    }

    if (inViewVertical && inViewHorizontal) {
        el.classList.add(opts.inViewClass)
    } else {
        el.classList.remove(opts.inViewClass)
    }
}

export default {
    bind: async function(el, binding) {
        const bindingValue = binding.value || {}
        const opts = {
            aboveClass: bindingValue.above || 'above-view',
            inViewClass: bindingValue.inView || 'in-view',
            belowClass: bindingValue.below || 'below-view',
            leftClass: bindingValue.left || 'left-of-view',
            rightClass: bindingValue.right || 'right-of-view',
            throttle: bindingValue.hasOwnProperty('throttle')
                ? bindingValue.throttle
                : 30,

            // enter events
            onEnter: bindingValue.onEnter || null,
            onEnterAbove: bindingValue.onEnterAbove || null,
            onEnterBelow: bindingValue.onEnterBelow || null,
            onEnterLeft: bindingValue.onEnterLeft || null,
            onEnterRight: bindingValue.onEnterRight || null,

            // leave events
            onLeave: bindingValue.onLeave || null,
            onLeaveAbove: bindingValue.onLeaveAbove || null,
            onLeaveBelow: bindingValue.onLeaveBelow || null,
            onLeaveLeft: bindingValue.onLeaveLeft || null,
            onLeaveRight: bindingValue.onLeaveRight || null
        }

        window.addEventListener(
            'scroll',
            throttle(() => {
                setHeight(el, opts)
                setRect(el, opts)
                setClass(el, opts)
            }, opts.throttle)
        )
        window.addEventListener(
            'mousewheel',
            throttle(() => {
                setHeight(el, opts)
                setRect(el, opts)
                setClass(el, opts)
            }, opts.throttle)
        )
        window.addEventListener(
            'resize',
            throttle(() => {
                setHeight(el, opts)
                setRect(el, opts)
                setClass(el, opts)
            }, opts.throttle)
        )

        // wait so we render the element
        await Vue.nextTick()

        // initial class
        setHeight(el, opts)
        setWidth(el, opts)
        setRect(el, opts)

        // run events if we're in the viewport and the 'appear' modifier is set
        const runEvents =
            binding.modifiers.appear != undefined &&
            top + height > 0 &&
            top < window.innerHeight
        setClass(el, opts, runEvents)
    }
}
</script>
