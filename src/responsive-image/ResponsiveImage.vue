<template>
    <div
        :class="['image-module', { loading }, { 'fill-space': fillSpace }]"
        :style="outerStyles"
        @mouseenter="$emit('mouseenter', $event)"
        @mouseleave="$emit('mouseleave', $event)">

        <div
            :class="['image-sizer']"
            :style="sizerStyles"
            v-html="imageTag">
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
                default(){
                    return {}
                }
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
                    'background-color': _get(this.object, 'primary_color', false) || this.color,
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

<style>
    .image-module {
        position: relative;
        width: 100%;
    }
    .image-module.fill-space {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
    .image-sizer {
        transition: opacity 0.6s ease;
        position: relative;
    }
    .fill-space .image-sizer {
        width: 100%;
        height: 100%;
    }
    .image-sizer img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .loading .image-sizer {
        opacity: 0;
    }
</style>
