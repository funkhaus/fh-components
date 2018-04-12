<script>
function reverseHover(el, binding) {
    // Initialize defaults
    let selectors = ['a']
    const bindingValue = binding.value || {}
    const processedClass = bindingValue.processedClass || 'rh-processed'
    const containerActivatedClass =
        bindingValue.containerActivatedClass || 'rh-active-within'
    const elActivatedClass = bindingValue.elActivatedClass || 'rh-active'

    // Read selectors, if we have any
    if (bindingValue.selector) {
        selectors = [bindingValue.selector]
    } else if (bindingValue.selectors) {
        selectors = bindingValue.selectors
    }

    // for each selector...
    selectors.map(selector => {
        // ...get all children that match that selector...
        return [...el.querySelectorAll(selector)].map(newTarget => {
            // ...and add the focus/hover callback if needed
            if (!newTarget.classList.contains(processedClass)) {
                // prevent duplicate listeners being added to this target in the future
                newTarget.classList.add(processedClass)

                // Function to add container and target classes
                function setupListenerAdd() {
                    // remove all other activated element classes
                    ![...el.querySelectorAll(`.${elActivatedClass}`)].map(old =>
                        old.classList.remove(elActivatedClass)
                    )

                    // add the new class to the element and container
                    el.classList.add(containerActivatedClass)
                    newTarget.classList.add(elActivatedClass)
                }

                // Add class addition listeners
                newTarget.addEventListener('mouseenter', setupListenerAdd)
                newTarget.addEventListener('focus', setupListenerAdd)

                // Function to remove container and target classes
                function setupListenerRemove() {
                    el.classList.remove(containerActivatedClass)
                    newTarget.classList.remove(elActivatedClass)
                }

                // Add class removal listeners
                newTarget.addEventListener('mouseleave', setupListenerRemove)
                newTarget.addEventListener('blur', setupListenerRemove)
            }
        })
    })
}

export default {
    inserted: function(el, binding) {
        reverseHover(el, binding)
    },
    componentUpdated: function(el, binding) {
        reverseHover(el, binding)
    }
}
</script>
