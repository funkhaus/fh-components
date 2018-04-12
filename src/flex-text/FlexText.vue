<template>
    <span class="flex-text-module" :style="{ 'font-size': `${ computedFontSize }px` }">
        <span class="ftm-placeholder" ref="placeholder" :style="{ 'font-size': '100px' }">{{ longestTitle }}</span>
        <span class="ftm-title" v-html="titleChunks.join('<br />')"></span>
    </span>
</template>

<script>
import _throttle from 'lodash/throttle'
import _concat from 'lodash/concat'
import _maxBy from 'lodash/maxBy'
import _last from 'lodash/last'
import _get from 'lodash/get'

export default {
    name: 'flex-text',
    props: {
        'line-size': {
            type: Number,
            default: 15
        },
        'min-size': {
            type: Number,
            default: 14
        },
        'max-size': {
            type: Number,
            default: Infinity
        }
    },
    data() {
        return {
            computedFontSize: 0,
            renderedSize: 0
        }
    },
    computed: {
        innerText() {
            // pull text from slot HTML
            return _get(this.$slots, 'default[0].text') || ''
        },
        titleChunks() {
            // split innertext into separate lines,
            // break occurs near each "lineSize" character count

            const words = this.innerText.split(' ')

            const chunks = words.reduce((acc, word) => {
                const lastWord = _last(acc)

                // if this plus last word are less than 10 chars, group
                if (lastWord && lastWord.length + word.length < this.lineSize) {
                    acc[acc.length - 1] = `${lastWord} ${word}`
                    return acc
                }

                // push to accumulator
                return _concat(acc, [word])
            }, [])

            return chunks
        },
        longestTitle() {
            // return longest title chunk
            return _maxBy(this.titleChunks, 'length')
        }
    },
    watch: {
        innerText() {
            // re-set size if text changes
            this.setSize()
        }
    },
    mounted() {
        // set size on mount, resize, and load
        this.setSize()
        window.addEventListener('resize', _throttle(this.setSize, 30))
        window.addEventListener('load', _throttle(this.setSize, 30))
    },
    methods: {
        measurePlaceholder() {
            // set rendered size of placeholder element
            if (this.$refs.placeholder) {
                this.renderedSize = this.$refs.placeholder.getBoundingClientRect().width
            }
        },
        setSize() {
            // do nothing if no parent el
            if (!this.$el.parentElement) return

            // make sure rendered size is set
            this.measurePlaceholder()

            // measure container to get target width
            const containerWidth = this.$el.parentElement.clientWidth

            // set font size accordingly
            const targetSize = containerWidth * 100 / this.renderedSize

            // set size to render, stay within max and min
            this.computedFontSize = Math.floor(
                Math.max(Math.min(targetSize, this.maxSize), this.minSize)
            )
        }
    }
}
</script>

<style scoped>
/* keep rendered, but move out of view */
.ftm-placeholder {
    visibility: hidden;
    position: absolute;
    display: inline;
    left: -100000px;
    opacity: 0;
    top: 0;
}
.ftm-title {
    line-height: 1em;
}
</style>
