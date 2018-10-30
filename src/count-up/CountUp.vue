<template>

    <span class="count-up">
        {{ displayValue }}
    </span>

</template>

<script>
import { chain, delay, tween } from 'popmotion'

let inProgress = null

export default {
    data() {
        return {
            displayValue: 0,
            running: false
        }
    },
    props: {
        from: {
            type: [String, Number],
            default: 0
        },
        to: {
            type: [String, Number],
            default: 100
        },
        duration: {
            type: Number,
            default: 700
        },
        delay: {
            type: Number,
            default: 0
        },
        appear: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        cmpValue() {
            return parseInt(this.number)
        }
    },
    mounted() {
        if (this.appear) {
            this.running = true
        }
    },
    methods: {
        start() {
            if (inProgress) {
                inProgress.stop()
            }

            // count up to target
            inProgress = chain(
                delay(this.delay),
                tween({
                    from: parseInt(this.from),
                    to: parseInt(this.to),
                    duration: this.duration
                })
            ).start({
                update: val => {
                    this.displayValue = Math.floor(val)
                },
                complete: () => (this.running = false)
            })
        }
    },
    watch: {
        running(val) {
            if (val) {
                this.start()
            }
        }
    }
}
</script>
