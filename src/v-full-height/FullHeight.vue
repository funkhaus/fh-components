<script>
export default {
    inserted(el, binding) {
        const property = binding.modifiers.min ? 'min-height' : 'height'

        el.style[property] = `${window.innerHeight}px`
        window.addEventListener('resize', () => {
            el.style[property] = `${window.innerHeight}px`
        })
    }
}
</script>
