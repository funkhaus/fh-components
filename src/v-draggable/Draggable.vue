<script>
const listeners = {}
let dragging = false
const lastPos = { x: 0, y: 0 }
const delta = { x: 0, y: 0 }

export default {
    bind(el, { value }) {
        const { dragStart, drag, dragStop } = value
        // start drag
        listeners.clicked = function(evt) {
            lastPos.x = evt.clientX
            lastPos.y = evt.clientY
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

                lastPos.x = evt.clientX
                lastPos.y = evt.clientY

                if (drag) {
                    drag(evt, { lastPos, delta })
                }
            }
        }
        // end drag
        listeners.released = function(evt) {
            lastPos.x = evt.clientX
            lastPos.y = evt.clientY
            dragging = false

            if (dragStop) {
                dragStop(el, lastPos)
            }
        }

        el.addEventListener('mousedown', listeners.clicked)
        el.addEventListener('mousemove', listeners.dragged)
        el.addEventListener('mouseup', listeners.released)
    },
    unbind(el, { value }) {
        const { dragStart, drag, dragStop } = value
        el.removeEventListener('mousedown', listeners.clicked)
        el.removeEventListener('mousemove', listeners.dragged)
        el.removeEventListener('mouseup', listeners.released)
    }
}
</script>
