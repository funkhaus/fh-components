<template>
    <div
        :class="['bg-image-module', { loading }, `fit-${ fit }`]"
        :style="styles"
        v-html="imageTag">
    </div>
</template>

<script>
    import imagesLoaded from 'imagesloaded'
    import _get from 'lodash/get'

    export default {
        props: {
            name: 'bg-image',
            object: {
                type: Object,
                default(){
                    return {}
                }
            },
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
            fit: {
                type: String,
                default: 'cover'
            }
        },
        data () {
            return {
                loading: true,
                loadedImage: false
            }
        },
        mounted () {
            if ( !this.parsedSrc ) return

            const img = new Image()
            img.src = this.parsedSrc

            imagesLoaded(img, () => {
                this.loading = false

                // save loaded image
                this.loadedImage = img
            })
        },
        computed: {
            svgBG() {
                return `data:image/svg+xml;utf8,
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        x="0px" y="0px" viewBox="0 0 ${ this.imgWidth } ${ this.imgHeight }" xml:space="preserve">
                        <rect fill="${ this.bgColor }" width="${ this.imgWidth }" height="${ this.imgHeight }"/>
                    </svg>`.replace(/\r?\n|\r/g, '')
            },
            parsedSrc(){
                if( this.src ) return this.src || ''
                return _get(this.object, `sizes.${ this.size }.url`, '')
            },
            imageTag(){
                return _get(this.object, `sizes.${ this.size }.html`)
            },
            bgColor() {
                return this.object.primary_color || this.color || 'transparent'
            },
            imgWidth () {
                return _get(this.object, `sizes.${ this.size }.width`) || this.width
            },
            imgHeight () {
                return _get(this.object, `sizes.${ this.size }.height`) || this.height
            },
            styles() {
                return this.fit == 'cover' ?
                    { backgroundColor: this.bgColor } :
                    { backgroundImage: `url('${ this.svgBG }')` }
            }
        }
    }

</script>

<style lang="scss">
    .bg-image-module {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;

        img {
            transition: opacity 0.6s ease;
            position: absolute;
            height: 100%;
            width: 100%;
        }

        // fits
        &.fit-contain {
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        }
        &.fit-cover img {
            object-fit: cover;
        }
        &.fit-contain img {
            object-fit: contain;
        }

        // loading state
        &.loading img {
            opacity: 0;
        }
    }
</style>
