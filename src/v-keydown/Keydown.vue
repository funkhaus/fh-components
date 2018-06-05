<script>
// we can only add and remove listeners for named functions, not anonymous ones,
// so this is where we'll store the named function
let func = null

export default {
    bind: (el, { modifiers, value }) => {
        func = function(evt) {
            if (
                !Object.keys(modifiers).length ||
                (evt.keyCode == 27 && modifiers.esc) ||
                (evt.keyCode == 38 && modifiers.up) ||
                (evt.keyCode == 39 && modifiers.right) ||
                (evt.keyCode == 40 && modifiers.down) ||
                (evt.keyCode == 37 && modifiers.left)
            ) {
                value()
            }
        }
        window.addEventListener('keydown', func)
    },
    unbind: (el, { modifiers, value }) => {
        window.removeEventListener('keydown', func)
    }
}
</script>
