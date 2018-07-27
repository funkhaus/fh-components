<script>
const listeners = {}
let dragging = false
const lastPos = { x: 0, y: 0 }
const delta = { x: 0, y: 0 }
const totalDelta = { x: 0, y: 0 }

export default {
    bind(el, { value }) {
        const { dragStart, drag, dragStop } = value
        // start drag
        listeners.clicked = function(evt) {
            lastPos.x = evt.clientX
            lastPos.y = evt.clientY

            // reset total delta
            totalDelta.x = 0
            totalDelta.y = 0

            // set dragging flag
            dragging = true

            if (dragStart) {
                dragStart(evt, lastPos)
            }
        }
        // drag
        listeners.dragged = function(evt) {
            if (dragging) {
                delta.x = evt.clientX - lastPos.x
                delta.y = evt.clientY - lastPos.y

                // save accumulated delta
                totalDelta.x += delta.x
                totalDelta.y += delta.y

                lastPos.x = evt.clientX
                lastPos.y = evt.clientY

                if (drag) {
                    drag(evt, { lastPos, delta, totalDelta })
                }
            }
        }
        // end drag
        listeners.released = function(evt) {
            lastPos.x = evt.clientX
            lastPos.y = evt.clientY
            dragging = false

            if (dragStop) {
                dragStop(evt, { lastPos, totalDelta })
            }
        }

        el.addEventListener('mousedown', listeners.clicked)
        el.addEventListener('mousemove', listeners.dragged)
        el.addEventListener('mouseup', listeners.released)
    },
    unbind(el, { value }) {
        el.removeEventListener('mousedown', listeners.clicked)
        el.removeEventListener('mousemove', listeners.dragged)
        el.removeEventListener('mouseup', listeners.released)
    }
}
</script>
