<template>
    <div v-in-view="{ onEnter }" class="load-on-view">
        <slot />
    </div>
</template>

<script>
import inView from '../../v-in-view'
import Vue from 'vue'

export default {
    props: {
        url: {
            type: String,
            default: ''
        },
        repeatUrl: {
            type: Boolean,
            default: false
        },
        fetchConfig: {
            type: Object,
            default: () => {
                return { credentials: 'same-origin' }
            }
        }
    },
    directives: {
        'in-view': inView
    },
    data() {
        return {
            ready: true
        }
    },
    watch: {
        url(newUrl) {
            this.ready = true
        }
    },
    async mounted() {
        await Vue.nextTick()

        // manually check on mount and load
        if (this.isInView()) this.onEnter()
        window.addEventListener('load', () => {
            if (this.isInView()) this.onEnter()
        })
    },
    methods: {
        isInView() {
            if (!this.$el.getBoundingClientRect) return false
            const rect = this.$el.getBoundingClientRect()
            return rect.top + rect.height > 0 && rect.top < window.innerHeight
        },
        async onEnter() {
            // do nothing if not ready
            if (!this.ready) return

            this.ready = false
            if (this.url) {
                try {
                    const r = await fetch(this.url, this.fetchConfig)
                    if (!r.ok) this.$emit('error', r.status)

                    let data = null

                    // detect type, emit accordingly
                    const contentType = r.headers.get('content-type')
                    if (contentType.match(/^text/)) {
                        data = await r.text()
                        this.$emit('on-text', data)
                    } else if (contentType.match(/^application\/json/)) {
                        data = await r.json()
                        this.$emit('on-json', data)
                    } else {
                        data = await r.arrayBuffer()
                        this.$emit('on-buffer', data)
                    }

                    // always emit this
                    this.$emit('data', data)
                } catch (err) {
                    this.$emit('error', err)
                }
            }

            // if able to repeat, reset immediately
            if (this.repeatUrl) this.ready = true
        }
    }
}
</script>
