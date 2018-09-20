<template>

    <component
        :is="wrapperComponent"
        class="reveal-footer">

        <div class="reveal-margin" :style="{ height: `${height}px` }"/>

        <div class="footer-wrap" ref="footer">
            <slot/>
        </div>

    </component>

</template>

<script>
import Vue from 'vue'

export default {
    props: {
        wrapperComponent: {
            type: String,
            default: 'footer'
        }
    },
    data() {
        return {
            height: 0
        }
    },
    async mounted() {
        window.addEventListener('resize', this.updateNeighborMargin)

        await Vue.nextTick()

        this.updateNeighborMargin()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateNeighborMargin)
    },
    methods: {
        updateNeighborMargin() {
            // measure height of footer
            if (this.$refs.footer && this.$refs.footer.getBoundingClientRect) {
                this.height = this.$refs.footer.getBoundingClientRect().height
            } else {
                this.height = 0
            }
        }
    }
}
</script>

<style lang="scss">
.reveal-footer {
    .footer-wrap {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
    }
}
</style>
