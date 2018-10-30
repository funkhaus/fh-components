<template>
    <button class="scroll-to" @click="scrollTo">
        <slot />
    </button>
</template>

<script>
import scrollToElement from 'scroll-to-element'
import _get from 'lodash/get'

export default {
    props: {
        target: {
            type: [String, Object],
            default: 'scroll-target'
        },
        duration: {
            type: Number,
            default: 1000
        },
        easing: {
            type: String,
            default: 'inOutQuad'
        },
        offset: {
            type: Number,
            default: 0
        },
        debug: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        scrollTo() {
            // attempt to get target from parent $refs
            const refTarget =
                _get(this, `$parent.$refs[${this.target}]`) ||
                _get(this, `$parent.$refs[${this.target}].$el`)

            // target fallback to CSS selector or DOM element
            const scrollTarget =
                refTarget || this.$parent.$el.querySelector(this.target)

            // complete and exit if there's nothing to scroll to
            if (!scrollTarget) {
                this.$emit('complete')

                if (this.debug) {
                    console.log('No scroll target found, exiting...')
                }

                return
            }

            if (this.debug) {
                console.log('Scrolling to element:', scrollTarget)
            }
            // scroll
            const scroller = scrollToElement(scrollTarget, {
                duration: this.duration,
                offset: this.offset,
                ease: this.easing
            })

            if (scroller) scroller.on('end', () => this.$emit('complete'))
        }
    }
}
</script>

<style lang="scss">
// reset button styling
.scroll-to {
    background-color: transparent;
    -webkit-appearance: none;
    border-radius: 0;
    cursor: pointer;
    display: block;
    border: none;
}
</style>
