<template>
    <transition
        @enter="enter"
        @leave="leave"
        :css="false"
        @before-enter="$emit('before-enter', $event)"
        @after-enter="$emit('after-enter', $event)"
        @before-leave="$emit('before-leave', $event)"
        @after-leave="$emit('after-leave', $event)"
    >
        <slot />
    </transition>
</template>

<script>
    import Velocity from 'velocity-animate'

    export default {
        name: 'transition-slide-toggle',
        props: {
            speed: {
                type: Number,
                default: 400
            },
            easing: {
                type: String,
                default: 'swing'
            }
        },
        methods: {
            enter (el, done) {
                Velocity(el, 'stop')
                Velocity(el, 'slideDown', {
                    duration: this.speed,
                    easing: this.easing,
                    complete: () => done()
                })

                // proxy event
                this.$emit('enter', ...arguments)
            },
            leave (el, done) {
                Velocity(el, 'stop')
                Velocity(el, 'slideUp', {
                    duration: this.speed,
                    easing: this.easing,
                    complete: () => done()
                })

                // proxy event
                this.$emit('leave', ...arguments)
            }
        }
    }
</script>
