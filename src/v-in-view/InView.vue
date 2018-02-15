<script>
    import throttle from 'lodash/throttle'

    let height = 0
    let top = 0
    let bottom = 0

    function setRect (el) {
        if( !el.getBoundingClientRect ){
            return
        }
        const rect = el.getBoundingClientRect()
        bottom = rect.bottom
        top = rect.top
    }

    function setHeight (el) {
        height = el.clientHeight || 0
    }

    function setClass(el, opts) {
        const possibleClasses = Object.values(opts)
        const currentClass = [...el.classList].find(className => possibleClasses.includes(className)) || ''
        let newClass = currentClass

        // In-view status
        if ( height && top + height <= 0 ){
            newClass = opts.aboveClass
        }
        else if ( top >= window.innerHeight ){
            newClass = opts.belowClass
        }
        else {
            newClass = opts.inViewClass
        }

        // Add class if in view
        if( currentClass != newClass ){
            if( currentClass ){
                el.classList.remove(currentClass)
            }
            el.classList.add(newClass)
        }
    }

    export default {
        bind: function(el, binding){
            const bindingValue = binding.value || {}
            const opts = {
                aboveClass: bindingValue.above || 'above-view',
                inViewClass: bindingValue.inView || 'in-view',
                belowClass: bindingValue.below || 'below-view'
            }

            window.addEventListener('scroll', throttle(() => {
                setHeight(el, opts)
                setRect(el, opts)
                setClass(el, opts)
            }, 30))
            window.addEventListener('resize', throttle(() => {
                setHeight(el, opts)
                setRect(el, opts)
                setClass(el, opts)
            }, 30))
        }
    }

</script>
