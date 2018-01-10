<template>

    <component :is="wrapper">
        <component
            v-for="(line, i) in computedText"
            :key="i"
            :class="`line-${ i + 1 }`"
            :is="getTag(i)"
            v-html="line"
        />
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
                type: String,
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
            computedText(){
                const sourceArray = this.text.split(this.separator)

                if( this.pieces === -1 ){
                    return sourceArray
                }

                return sourceArray.filter( (line, i) => typeof this.pieces === 'number' ? this.pieces === i : this.pieces.includes(i) )
            }
        },
        methods: {
            getTag(index){
                if( typeof this.elements === 'string' ){
                    return this.elements
                } else if( index < this.elements.length ){
                    return this.elements[index]
                } else {
                    return this.elements[this.elements.length - 1]
                }
            }
        }
    }

</script>
