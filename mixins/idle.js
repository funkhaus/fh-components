export default {
    data() {
        return {
            idle: false,
            idleDelay: 5000
        }
    },
    mounted() {
        this.resetIdleTimer()
        this.$el.addEventListener('mousemove', this.resetIdleTimer)
        window.addEventListener('scroll', this.resetIdleTimer)
    },
    beforeDestroy() {
        this.$el.removeEventListener('mousemove', this.resetIdleTimer)
        window.removeEventListener('scroll', this.resetIdleTimer)
    },
    methods: {
        resetIdleTimer() {
            clearTimeout(this.idleCountdown)
            this.idle = false
            this.idleCountdown = setTimeout(
                () => (this.idle = true),
                this.idleDelay
            )
        }
    }
}
