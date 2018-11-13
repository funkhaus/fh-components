<template>
    <div
        v-if="iframeCode"
        :class="classes"
    >
        <slot name="before" />
        <div
            class="iframe"
            v-html="iframeCode || ''"
            :style="frameStyles"
        />
        <slot name="after" />
    </div>
</template>

<script>
import fitToParent from 'fit-to-parent'
import Player from '@vimeo/player'
import Vue from 'vue'

export default {
    name: 'video-stage',
    props: {
        src: {
            type: String,
            default: ''
        },
        autoplay: {
            type: [Boolean, String, Number],
            default: true
        },
        autoOffsets: {
            type: Boolean,
            default: false
        },
        paused: {
            type: Boolean,
            default: false
        },
        muted: {
            type: Boolean,
            default: false
        },
        playsinline: {
            type: Boolean,
            default: false
        },
        isResponsive: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            iframeCode: '',
            loadingEmbed: false,
            player: null,
            aspect: null
        }
    },
    watch: {
        src() {
            this.newSource()
        },
        iframeCode(embed) {
            if (embed && embed.includes('vimeo.com')) {
                Vue.nextTick(this.initVimeoPlayer)
            }
            Vue.nextTick(this.sizeVideo)
        },
        paused(newVal) {
            if (newVal) {
                this.player.pause()
            } else {
                this.player.play()
            }
        }
    },
    mounted() {
        this.newSource()
        window.addEventListener('resize', this.sizeVideo)
    },
    beforeDestroy() {
        this.destroyVimeoPlayer()
        window.removeEventListener('resize', this.sizeVideo)
    },
    computed: {
        isIframe() {
            return String(this.src).includes('<iframe')
        },
        embedIsVimeo() {
            return this.parsedEmbed && this.parsedEmbed.includes('vimeo.com')
        },
        classes() {
            return [
                'video-stage-module',
                'size-parent',
                { loading: this.loadingEmbed },
                { 'is-responsive': this.isResponsive },
                { 'not-responsive': !this.isResponsive }
            ]
        },
        frameStyles() {
            if (this.isResponsive && this.aspect) {
                return {
                    'padding-bottom': `${this.aspect * 100}%`
                }
            }
            return {}
        }
    },
    methods: {
        onPlay() {
            this.$emit('play', ...arguments)
        },
        onPause() {
            this.$emit('pause', ...arguments)
        },
        onEnded() {
            this.$emit('ended', ...arguments)
        },
        async newSource() {
            if (!this.isIframe) {
                this.iframeCode = await this.fetchOembed(this.src)
                return this.iframeCode
            }
            this.iframeCode = this.src
        },
        async initVimeoPlayer() {
            // init player
            this.player = new Player(this.getIframe(), {
                muted: this.muted,
                playsinline: this.playsinline
            })
            await this.player.ready()

            // set iframe events
            this.player.on('play', this.onPlay)
            this.player.on('pause', this.onPause)
            this.player.on('ended', this.onEnded)

            // if set to auto, play
            if (this.autoplay) {
                await this.player.setVolume(0)
                this.player.play()
            }
        },
        getIframe() {
            return this.$el.querySelector && this.$el.querySelector('iframe')
        },
        setAspect() {
            const frame = this.$el.querySelector('iframe')
            if (frame) {
                const aspect = frame.dataset.aspect
                if (aspect) {
                    this.aspect = 1 / aspect
                    this.$nextTick(this.sizeVideo)
                }
            }
        },
        sizeVideo() {
            let frame
            if ((frame = this.getIframe())) {
                let heightOffset = 0
                if (this.autoOffsets) {
                    // total height of all slot elements (only if auto is true)
                    heightOffset = Object.keys(this.$slots).reduce(
                        (acc, key) => {
                            const slotItems = this.$slots[key] || []
                            const slotHeight = slotItems.reduce((acc, item) => {
                                const rect = item.elm.getBoundingClientRect()
                                const height = rect.height || 0
                                return acc + height
                            }, 0)

                            return slotHeight
                        },
                        0
                    )
                }

                // defaults
                let newWidth = 16,
                    newHeight = 9

                // run ftp
                try {
                    let [newWidth, newHeight] = fitToParent({
                        element: frame,
                        heightOffset
                    })
                    this.$emit('width', newWidth)
                    this.$emit('height', newHeight)
                } catch (err) {
                    this.$emit('error', err)
                }

                // set aspect ratio once we know it
                if (this.aspect === null) {
                    this.setAspect()
                }
            }
        },
        destroyVimeoPlayer() {
            if (this.player) {
                // set iframe events
                this.player.off('play', this.onPlay)
                this.player.off('pause', this.onPause)
                this.player.off('ended', this.onEnded)

                this.player = null
            }
        },
        isVimeo(url) {
            return String(url).match(RegExp('https?://(.+.)?vimeo.com/.*'))
        },
        async fetchOembed(url) {
            // fetch from vimeo
            if (this.isVimeo(url)) {
                this.loadingEmbed = true
                const base = 'https://vimeo.com/api/oembed.json'
                const encoded = encodeURIComponent(this.src)
                const response = await fetch(`${base}?url=${encoded}`).then(r =>
                    r.json()
                )
                this.loadingEmbed = false
                return response && response.html ? response.html : ''
            }

            // TODO: other types of oembed support here if possible

            return ''
        }
    }
}
</script>

<style lang="scss">
.video-stage-module {
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: absolute;
    display: flex;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;

    &.is-responsive {
        position: relative;

        .iframe {
            width: 100%;
            height: 0;
        }
    }
}
</style>
