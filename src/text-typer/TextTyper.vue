<template>

    <component class="text-typer" :is="wrapper" v-html="cmpHtml"/>

</template>

<script>
export default {
    props: {
        wrapper: {
            type: String,
            default: 'span'
        },
        html: {
            type: String,
            default: ''
        },
        minTime: {
            type: Number,
            default: 2
        },
        maxTime: {
            type: Number,
            default: 5
        }
    },
    mounted() {
        this.startTyping()
    },
    data() {
        return {
            inclusiveStart: 0,
            inclusiveEnd: 0,
            split: [],
            timeout: null
        }
    },
    computed: {
        cmpHtml() {
            return this.split
                .slice(this.inclusiveStart, this.inclusiveEnd)
                .join('')
        }
    },
    methods: {
        getTime() {
            const diff = this.maxTime - this.minTime
            return Math.random() * diff + this.minTime
        },
        nextCharacter() {
            this.inclusiveEnd++

            while (
                this.inclusiveEnd < this.split.length &&
                this.split[this.inclusiveEnd].startsWith('<')
            ) {
                this.inclusiveEnd++
            }

            if (this.inclusiveEnd < this.split.length && !this.dirty) {
                this.timeout = setTimeout(this.nextCharacter, this.getTime())
            }
        },
        startTyping() {
            let queue = ''
            this.inclusiveEnd = 0
            this.split = []

            for (let char of this.html) {
                // if we're starting an HTML element, prep the queue
                if (char == '<') {
                    queue = char
                } else if (char == '>') {
                    queue += char
                    this.split.push(queue)
                    queue = ''
                } else if (queue.length) {
                    queue += char
                } else {
                    this.split.push(char)
                }
            }

            this.timeout = setTimeout(this.nextCharacter, this.getTime())
        }
    },
    watch: {
        html() {
            clearTimeout(this.timeout)
            this.startTyping()
        }
    }
}
</script>
