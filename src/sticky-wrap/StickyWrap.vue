<template>
    <component :is="wrapper" class="sticky-wrap" ref="wrapper">

        <div class="sticky-translated" ref="translated" :style="cmpStyle">
            <slot/>
        </div>

    </component>
</template>

<script>
export default {
    props: {
        wrapper: {
            type: String,
            default: 'div'
        },
        margin: {
            type: [Number, String],
            default: 0
        },
        max: {
            type: [Number, String],
            default: -1
        }
    },
    data() {
        return {
            translateAmount: 0
        }
    },
    mounted() {
        addEventListener('resize', this.updateSticky)
        addEventListener('scroll', this.updateSticky)
    },
    beforeDestroy() {
        removeEventListener('resize', this.updateSticky)
        removeEventListener('scroll', this.updateSticky)
    },
    computed: {
        cmpStyle() {
            return {
                transform: `translateY(${this.translateAmount}px)`
            }
        },
        cmpMax() {
            if (typeof this.max == 'number' || typeof this.max == 'string') {
                return parseInt(this.max)
            }

            return -1
        },
        cmpMargin() {
            return parseInt(this.margin) || 0
        }
    },
    methods: {
        updateSticky() {
            const rect = this.$refs.wrapper.getBoundingClientRect()
            let newTranslateAmount =
                rect.top < this.cmpMargin ? (rect.top - this.cmpMargin) * -1 : 0
            newTranslateAmount =
                this.cmpMax == -1
                    ? newTranslateAmount
                    : Math.min(newTranslateAmount, this.cmpMax)
            this.translateAmount = newTranslateAmount
        }
    }
}
</script>
