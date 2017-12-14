<template>

    <div class="video-player">

        <div class="loading-wrap" v-if="!embedHtml">
            <slot name="loading"></slot>
        </div>

        <div class="stage" v-else>

            <div class="iframe-wrap" v-html="embedHtml"></div>

            <div class="meta-wrap" :style="metaWrapStyle">
                <slot></slot>
            </div>

        </div>

        <slot name="after"></slot>

    </div>

</template>

<script>
export default {
    props: {
        'aspect': {
            type: Number,
            default: 0.5625
        },
        'autoplay': {
            type: Boolean,
            default: true
        },
        'margins': {
            type: String,
            default: '80px'
        },
        'vimeo-url': {
            type: String,
            default: ''
        },
        'vimeo-id': {
            type: Number,
            default: -1
        },
        'vimeo-embed': {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            embedHtml: '',
            iframeWidth: 0
        }
    },
    computed: {
        metaWrapStyle(){
            return {
                width: this.iframeWidth
            }
        }
    },
    async mounted(){
        // attach resize listener
        this.$root.$on('throttled.resize', this.updateIframeWidth);

        if( this.vimeoEmbed ){
            // use specified embed HTML and render
            this.embedHtml = this.vimeoEmbed
            this.updateIframeWidth()
            return
        }
        // fetch HTML using Vimeo embed API (https://developer.vimeo.com/apis/oembed)
        let vimeoUrl = `https://vimeo.com/api/oembed.json?url=`
        if( this.vimeoId != -1 ){
            vimeoUrl += `https://vimeo.com/${ this.vimeoId }`
        } else {
            vimeoUrl += this.vimeoUrl
        }
        vimeoUrl += `&autoplay=${ this.autoplay }`
        this.embedHtml = await
            fetch(vimeoUrl)
            .then( res => {
                if( !res.ok ){
                    // fetch error handling:
                    // https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
                    throw Error(res.statusText)
                }
                return res.json()
            } )
            .then( json => {
                this.$emit('videoLoaded')
                return json.html
            } )
            .catch( err => console.log(err) )
    },
    beforeDestroy () {
        this.$root.$off('throttled.resize', this.updateIframeWidth);
    },
    methods: {
        updateIframeWidth(){
            const iframe = this.$el.querySelector('.stage')
            this.iframeWidth = iframe
                ? iframe.getBoundingClientRect().width + 'px'
                : '100%'
        }
    },
    watch: {
        embedHtml(){
            this.updateIframeWidth()
        }
    }
}
</script>

<style scoped>
    .video-player .stage {
        position: absolute;
    }
    .video-player .stage .iframe-wrap {
        position: relative;
        height: 100%;
    }
    .video-player .stage iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
    }
    .video-player .stage .meta-wrap {
        position: absolute;
        margin: auto;
        top: 100%;
        right: 0;
        left: 0;
    }
</style>
