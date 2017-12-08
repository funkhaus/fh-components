<template>
    <div
        :class="['rsp-image-module', { loading }, { 'fill-space': fillSpace }]"
        :style="outerStyles"
    >

        <div
            class="image-sizer"
            v-if="!videoSrc"
            :style="sizerStyles"
            v-html="imageTag"
        />
        <div
            class="image-sizer video"
            v-else="!videoSrc"
            :style="sizerStyles"
        >
            <video :src="videoSrc" autoplay loop muted :poster="parsedSrc" />
        </div>

    </div>
</template>

<script>
    import imagesLoaded from 'imagesloaded'
    import _get from 'lodash/get'

    export default {
        props: {
            object: {
                type: Object,
                default: () => ({})
            },
            html: String,
            src: String,
            height: [String, Number],
            width: [String, Number],
            aspect: [String, Number],
            size: {
                type: String,
                default: 'full'
            },
            color: {
                type: String,
                default: 'transparent'
            },
            'fill-space': {
                type: Boolean,
                default: false
            },
            fit: {
                type: String,
                default: 'cover'
            }
        },
        data () {
            return {
                loading: true,
                loadedImage: false,
                imageWidth: 0,
                imageHeight: 0
            }
        },
        mounted () {
            const img = new Image()
            img.src = this.parsedSrc

            // set up height/width if we have an object
            if( this.object ){
                this.imageWidth = _get(this.object, `sizes.${ this.size }.width`)
                this.imageHeight = _get(this.object, `sizes.${ this.size }.height`)
            }

            imagesLoaded(img, () => {
                this.loading = false

                // save loaded image
                this.loadedImage = img

                // update stats
                this.imageWidth = img.width
                this.imageHeight = img.height
            })
        },
        computed: {
            videoSrc () {
                const alt = _get(this.object, 'alt', '')
                return String(alt).includes('.mp4') ? alt : ''
            },
            parsedSrc(){
                if( this.src ) return this.src
                return _get(this.object, `sizes.${ this.size }.url`)
            },
            parsedHeight(){
                // default to defined height
                if( this.height ) return parseInt(this.height)

                return this.imageHeight
            },
            parsedWidth(){
                // default to defined width
                if( this.width ) return parseInt(this.width)

                return this.imageWidth
            },
            aspectPadding () {
                const calculatedAspect = (this.parsedHeight / this.parsedWidth) * 100
                return this.aspect || calculatedAspect || 56.25
            },
            outerStyles () {
                return {
                    'background-color': _get(this.object, 'primary_color') || this.color,
                    'max-width': this.respectMax ? `${ this.parsedWidth }px` : 'initial',
                    'max-height': this.respectMax ? `${ this.parsedHeight }px` : 'initial'
                }
            },
            sizerStyles () {
                if( !this.fillSpace ){
                    return {
                        paddingBottom: `${this.aspectPadding}%`
                    }
                }
                return {}
            },
            imageTag(){
                // TODO: Add other img attributes
                const fallback = `<img src="${ this.parsedSrc }">`
                return _get(this.object, `sizes.${ this.size }.html`, this.html ? this.html : fallback)
            }
        }
    }

</script>

<style lang="scss">
    .rsp-image-module {
        position: relative;
        width: 100%;

        .image-sizer {
            transition: opacity 0.6s ease;
            position: relative;
            overflow: hidden;
        }
        .image-sizer img,
        .image-sizer video {
            position: absolute;
            object-fit: cover;
            height: 100%;
            width: 100%;
            left: 0;
            top: 0;
        }

        // fill-space state
        &.fill-space {
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            top: 0;
        }
        &.fill-space .image-sizer {
            height: 100%;
            width: 100%;
        }

        // loading state
        &.loading .image-sizer {
            opacity: 0;
        }
    }
</style>
