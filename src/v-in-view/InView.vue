<script>
import throttle from 'lodash/throttle'
import Vue from 'vue'

let height = 0
let top = 0
let bottom = 0

function setRect(el) {
    if (!el.getBoundingClientRect) {
        return
    }
    const rect = el.getBoundingClientRect()
    bottom = rect.bottom
    top = rect.top
}

function setHeight(el) {
    height = el.clientHeight || 0
}

function setClass(el, opts, runEvents = true) {
    const possibleClasses = Object.values(opts)
    const currentClass =
        [...el.classList].find(className =>
            possibleClasses.includes(className)
        ) || ''
    let newClass = currentClass
    let eventType = []

    // In-view status
    if (height && top + height <= 0) {
        newClass = opts.aboveClass
        eventType.push('leave-view', 'above')
    } else if (top >= window.innerHeight) {
        newClass = opts.belowClass
        eventType.push('leave-view', 'below')
    } else {
        newClass = opts.inViewClass
        eventType.push('enter-view')

        if (currentClass == opts.aboveClass) {
            eventType.push('above')
        } else {
            eventType.push('below')
        }
    }

    // Add class if in view
    if (currentClass != newClass) {
        if (currentClass) {
            el.classList.remove(currentClass)
        }
        el.classList.add(newClass)

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
}

export default {
    bind: async function(el, binding) {
        const bindingValue = binding.value || {}
        const opts = {
            aboveClass: bindingValue.above || 'above-view',
            inViewClass: bindingValue.inView || 'in-view',
            belowClass: bindingValue.below || 'below-view',
            throttle: bindingValue.hasOwnProperty('throttle')
                ? bindingValue.throttle
                : 30,

            // events
            onEnter: bindingValue.onEnter || null,
            onEnterAbove: bindingValue.onEnterAbove || null,
            onEnterBelow: bindingValue.onEnterBelow || null,
            onLeave: bindingValue.onLeave || null,
            onLeaveAbove: bindingValue.onLeaveAbove || null,
            onLeaveBelow: bindingValue.onLeaveBelow || null
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
