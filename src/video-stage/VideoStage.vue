<template>
    <div
        v-if="iframeCode"
        :class="['video-stage-module', { loading: loadingEmbed }]"
        v-html="iframeCode || ''"
    />
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
            }
        },
        data () {
            return {
                iframeCode: '',
                loadingEmbed: false,
                player: null
            }
        },
        watch: {
            src () { this.newSource() },
            iframeCode (embed) {
                if ( embed && embed.includes('vimeo.com') ){
                    Vue.nextTick(this.initVimeoPlayer)
                }
                Vue.nextTick(this.sizeVideo)
            }
        },
        mounted () {
            this.newSource()
            window.addEventListener('resize', this.sizeVideo)
        },
        beforeDestroy () {
            this.destroyVimeoPlayer()
            window.removeEventListener('resize', this.sizeVideo)
        },
        computed: {
            isIframe () {
                return String(this.src).includes('<iframe')
            },
            embedIsVimeo () {
                return this.parsedEmbed && this.parsedEmbed.includes('vimeo.com')
            }
        },
        methods: {
            onPlay () { this.$emit('play', ...arguments) },
            onPause () { this.$emit('pause', ...arguments) },
            onEnded () { this.$emit('ended', ...arguments) },
            async newSource () {
                if ( !this.isIframe ) {
                    this.iframeCode = await this.fetchOembed(this.src)
                    return this.iframeCode
                }
                this.iframeCode = this.src
            },
            async initVimeoPlayer () {

                // init player
                this.player = new Player(this.getIframe())
                await this.player.ready()

                // set iframe events
                this.player.on('play', this.onPlay)
                this.player.on('pause', this.onPause)
                this.player.on('ended', this.onEnded)

                // if set to auto, play
                if ( this.autoplay ) {
                    await this.player.setVolume(0)
                    this.player.play()
                }
            },
            getIframe () {
                return this.$el.querySelector && this.$el.querySelector('iframe')
            },
            sizeVideo () {
                let frame
                if ( frame = this.getIframe() ) {
                    fitToParent({
                        element: frame,
                        heightOffset: 0
                    })
                }
            },
            destroyVimeoPlayer () {

                // set iframe events
                this.player.off('play', this.onPlay)
                this.player.off('pause', this.onPause)
                this.player.off('ended', this.onEnded)

                this.player = null
            },
            isVimeo (url) {
                return String(url).match(RegExp('https?://(.+\.)?vimeo\.com/.*'))
            },
            async fetchOembed (url) {

                // fetch from vimeo
                if ( this.isVimeo(url) ){
                    this.loadingEmbed = true
                    const base = 'https://vimeo.com/api/oembed.json'
                    const encoded = encodeURIComponent(this.src)
                    const response = await fetch(`${ base }?url=${ encoded }`).then(r => r.json())
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
        position: absolute;
        display: flex;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
    }
    .video-stage-module iframe {
        margin: auto;
    }

</style>
