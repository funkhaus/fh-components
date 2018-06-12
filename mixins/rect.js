import _throttle from 'lodash/throttle'

export default {
    data() {
        return {
            clientRect: null
        }
    },
    mounted() {
        window.addEventListener('scroll', _throttle(this.setRect, 150))
        window.addEventListener('resize', _throttle(this.setRect, 150))
        this.$nextTick(this.setRect)
    },
    methods: {
        setRect() {
            if (this.$el && this.$el.getBoundingClientRect)
                this.clientRect = this.$el.getBoundingClientRect()
        }
    }
}
