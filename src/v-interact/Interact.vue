<script>
import _get from 'lodash.get'
let allEvents = {}
let savedEvents = {}
let el = null

const setup = function(el, binding) {
    if (!el) {
        // ignore if no element exists
        return
    }

    // does the directive have the "end" modifier?
    const isEnd = _get(binding, 'modifiers.end', false)

    // get the default callback
    let callback =
        typeof binding.value == 'function'
            ? binding.value
            : _get(binding, 'value.callback', () => {})

    // default events
    const defaultEvents = isEnd
        ? {
              mouseleave: callback,
              blur: callback
          }
        : {
              mouseenter: callback,
              focus: callback
          }

    // object of events we're consolidating
    allEvents = _get(binding, 'value.events', defaultEvents)

    // add new events
    Object.keys(allEvents).map((evt, i) => {
        const cb = _get(binding, `value.events[${evt}]`, callback)
        el.addEventListener(evt, thisEvent => cb(thisEvent))
    })
}

export default {
    bind: (el, binding) => setup(el, binding)
}
</script>
