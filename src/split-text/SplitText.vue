<template>

    <component :is="wrapper">

        <slot name="before"/>

        <component
            v-for="(line, i) in computedText"
            :key="i"
            :class="['line', `line-${ i + 1 }`]"
            :is="getTag(i)"
            v-html="line"
        />

        <slot name="after"/>

    </component>

</template>

<script>
export default {
    props: {
        elements: {
            type: [String, Array],
            default: 'span'
        },
        pieces: {
            type: [Number, Array],
            default: -1
        },
        separator: {
            type: [String, Array],
            default: ' &#8211; '
        },
        text: {
            type: String,
            default: ''
        },
        wrapper: {
            type: String,
            default: 'span'
        }
    },
    computed: {
        computedText() {
            let computedSeparator = this.separator

            if (typeof computedSeparator != 'string') {
                // find first instance where separator returns multiple values
                const firstSuccessfulSeparator = computedSeparator.find(
                    sep => this.text.split(sep).length > 1
                )
                if (firstSuccessfulSeparator != undefined) {
                    // if we found one, use it
                    computedSeparator = firstSuccessfulSeparator
                } else {
                    // otherwise, use the first separator in array
                    computedSeparator = computedSeparator[0]
                }
            }

            // otherwise, slice text with working separator
            const sourceArray = this.text.split(computedSeparator)

            if (this.pieces === -1) {
                return sourceArray
            }

            return sourceArray.filter(
                (line, i) =>
                    typeof this.pieces === 'number'
                        ? this.pieces === i
                        : this.pieces.includes(i)
            )
        }
    },
    methods: {
        getTag(index) {
            if (typeof this.elements === 'string') {
                return this.elements
            } else if (index < this.elements.length) {
                return this.elements[index]
            } else {
                return this.elements[this.elements.length - 1]
            }
        }
    }
}
</script>
