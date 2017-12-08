<script>

    export default {
        inserted (el) {
            el.style.height = `${ window.innerHeight }px`
            window.addEventListener('resize', () => {
                el.style.height = `${ window.innerHeight }px`
            })
        }
    }

</script>
