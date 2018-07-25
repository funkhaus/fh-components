<script>
export default {
    bind: function(el, { value }) {
        const className = value || 'animating'
        const activateEvents = ['mouseenter', 'focus']
        const deactivateEvents = ['mouseleave', 'focusout']
        const iterationEvents = [
            'animationiteration',
            'webkitAnimationIteration'
        ]

        function cancelReadyToRemove() {
            iterationEvents.map(evt => el.removeEventListener(evt, removeClass))
        }
        function removeClass() {
            el.classList.remove(className)
            cancelReadyToRemove()
        }
        function addClass() {
            cancelReadyToRemove()
            el.classList.add(className)
        }
        function readyToRemove() {
            iterationEvents.map(evt => el.addEventListener(evt, removeClass))
        }

        // on hover/focus, cancel the remove listener and add class
        activateEvents.map(evt => el.addEventListener(evt, addClass))
        // on blur/focusout, mark ready for remove
        deactivateEvents.map(evt => el.addEventListener(evt, readyToRemove))
    }
}
</script>
