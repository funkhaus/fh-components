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
        }
    },
    methods: {
        scrollTo() {
            // attempt to get target from parent $refs
            const refTarget =
                _get(this, `$parent.$refs[${this.target}]`) ||
                _get(this, `$parent.$refs[${this.target}].$el`)

            // target fallback to CSS selector or DOM element
            const scrollTarget = refTarget || this.target

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
