<script>
// save listeners to be removed later
const listeners = {}

export default {
    bind: function(el) {
        // wrap the target element
        const wrapper = document.createElement('div')
        el.parentNode.insertBefore(wrapper, el)
        const wrappedEl = wrapper.appendChild(el)

        // checks if the wrapper's and screen's bottom edges line up
        const checker = function(evt) {
            const rect = wrapper.getBoundingClientRect()

            if (rect) {
                const elBottomFromScreenBottom =
                    window.innerHeight - rect.bottom

                // if so, translate the wrapped element so it stays at the bottom of the screen
                if (elBottomFromScreenBottom > 0) {
                    wrappedEl.style.transform = `translateY(${elBottomFromScreenBottom}px)`
                } else {
                    // if not, keep the wrapped element where it belongs
                    wrappedEl.style.transform = `translateY(0px)`
                }
            }
        }

        listeners['checker'] = checker

        addEventListener('scroll', checker)
        addEventListener('resize', checker)
    },
    unbind: function(el) {
        Object.keys(listeners).map(key => {
            removeEventListener('scroll', listeners[key])
            removeEventListener('resize', listeners[key])
        })
    }
}
</script>
