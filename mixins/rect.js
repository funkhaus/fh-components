import _throttle from 'lodash/throttle'

export default {
    data() {
        return {
            clientRect: null,
            rectThrottle: 150
        }
    },
    mounted() {
        window.addEventListener(
            'scroll',
            _throttle(this.setRect, this.rectThrottle)
        )
        window.addEventListener(
            'resize',
            _throttle(this.setRect, this.rectThrottle)
        )
        this.$nextTick(this.setRect)
    },
    methods: {
        setRect() {
            if (this.$el && this.$el.getBoundingClientRect)
                this.clientRect = this.$el.getBoundingClientRect()
        }
    }
}
