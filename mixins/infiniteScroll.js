import _get from 'lodash/get'

export default {
    data() {
        return {
            nextUrl: '',
            grid: this.$store.state.loop
        }
    },
    mounted() {
        // set nextUrl if it isn't yet
        if (!this.nextUrl) {
            this.nextUrl =
                _get(this, '$store.state.meta.nextPage', '') +
                '?contentType=json'
        }
    },
    methods: {
        loadNext(data) {
            this.grid = this.grid.concat(_get(data, 'loop', []))
            this.nextUrl = _get(data, 'meta.nextPage', '')
        }
    }
}
