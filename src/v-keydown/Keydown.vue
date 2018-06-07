<script>
// we can only add and remove listeners for named functions, not anonymous ones,
// so this is where we'll store the named functions
let funcs = {}

export default {
    bind: (el, { modifiers, value }) => {
        const modifierKeys = Object.keys(modifiers)
        const hasModifiers = modifierKeys.length

        const func = function(evt) {
            if (
                !hasModifiers ||
                (evt.keyCode == 27 && modifiers.esc) ||
                (evt.keyCode == 38 && modifiers.up) ||
                (evt.keyCode == 39 && modifiers.right) ||
                (evt.keyCode == 40 && modifiers.down) ||
                (evt.keyCode == 37 && modifiers.left)
            ) {
                value()
            }
        }

        const key = hasModifiers ? modifierKeys.join('') : 'all'
        funcs[key] = func

        window.addEventListener('keydown', funcs[key])
    },
    unbind: (el, { modifiers, value }) => {
        Object.keys(funcs).map(key => {
            window.removeEventListener('keydown', funcs[key])
        })

        funcs = {}
    }
}
</script>
