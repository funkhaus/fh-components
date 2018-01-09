<template>

    <component :is="wrapper">
        <component
            v-for="(line, i) in computedText"
            :key="i"
            :class="`line-${ i + 1 }`"
            :is="getTag(i)">
            {{ line }}
        </component>
    </component>

</template>

<script>

    export default {
        props: {
            elements: {
                type: [String, Array],
                default: 'span'
            },
            separator: {
                type: String,
                default: ' - '
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
                return this.text.split(this.separator)
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
