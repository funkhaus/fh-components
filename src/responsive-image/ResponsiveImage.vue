<template>
    <div :class="classes" :style="outerStyles">

        <div
            v-if="parsedSrc || html"
            class="image-sizer"
            :style="sizerStyles"
            v-html="videoTag || imageTag || ''"
        />

        <slot></slot>

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
        'video-src': String,
        size: {
            type: String,
            default: 'full'
        },
        color: {
            type: String,
            default: 'transparent'
        },
        'respect-max': {
            type: Boolean,
            default: false
        },
        'fill-space': {
            type: Boolean,
            default: false
        },
        fit: {
            type: String,
            default: 'cover'
        },
        poster: {
            type: [String],
            default: ''
        }
    },
    data() {
        return {
            loading: true,
            imageWidth: 0,
            imageHeight: 0
        }
    },
    watch: {
        object() {
            this.setObjectDimensions()
        }
    },
    created() {
        const img = new Image()
        img.src = this.parsedSrc

        // image was already in cache,
        // set loading var immediately
        if (img.complete) this.loading = false

        // set up height/width if we have an object
        this.setObjectDimensions()

        // wait for image to load...
        imagesLoaded(img, () => {
            this.loading = false

            // update stats
            this.imageWidth = img.width
            this.imageHeight = img.height
        })
    },
    methods: {
        setObjectDimensions() {
            if (this.object) {
                this.imageWidth = _get(this.targetSize, `width`)
                this.imageHeight = _get(this.targetSize, `height`)
            }
        }
    },
    computed: {
        classes() {
            return [
                'rsp-image-module',
                `fit-${this.fit}`,
                { loading: this.loading },
                { 'fill-space': this.fillSpace },
                { 'has-video': this.parsedVideoSrc }
            ]
        },
        parsedSrc() {
            if (this.src) return this.src
            return _get(this.targetSize, `url`)
        },
        targetSize() {
            // get sizes from image object
            const sizes = _get(this.object, `sizes`, {})

            // get specified size, or first available size
            return (
                _get(sizes, this.size) || sizes[_get(Object.keys(sizes), '[0]')]
            )
        },
        parsedHeight() {
            // default to defined height
            if (this.height) return parseInt(this.height)
            return this.imageHeight
        },
        parsedWidth() {
            // default to defined width
            if (this.width) return parseInt(this.width)
            return this.imageWidth
        },
        parsedColor() {
            return _get(this.object, 'primary_color') || this.color
        },
        aspectPadding() {
            // default to defined aspect, or calculate
            const calculatedAspect = this.parsedHeight / this.parsedWidth * 100
            return this.aspect || calculatedAspect || 56.25
        },
        parsedVideoSrc() {
            const metaString =
                _get(this.object, 'meta.custom_video_url') ||
                _get(this.object, 'alt', '')
            if (this.videoSrc || this.videoSrc === false) return this.videoSrc
            else return String(metaString).includes('.mp4') ? metaString : ''
        },
        videoTag() {
            return this.parsedVideoSrc
                ? `<video src="${
                      this.parsedVideoSrc
                  }" autoplay loop muted playsinline poster="${
                      this.parsedPoster
                  }"></video>`
                : ''
        },
        outerStyles() {
            const styles = {}

            // set max dims if needed
            if (this['respect-max']) {
                styles['max-width'] = `${this.parsedWidth}px`
                styles['max-height'] = `${this.parsedHeight}px`
            }

            // add svg bg if needed
            if (this.parsedColor && this.parsedColor !== 'transparent') {
                // set color or SVG background depending on settings
                if (this.fit == 'cover')
                    styles['background-color'] = this.parsedColor
                else styles['background-image'] = `url("${this.svgBG}")`

                // set fit
                styles['background-size'] = this.fit
            }

            return styles
        },
        sizerStyles() {
            if (!this.fillSpace) {
                return {
                    paddingBottom: `${this.aspectPadding}%`
                }
            }
            return {}
        },
        imageTag() {
            // TODO: Add other img attributes
            const fallback = `<img src="${this.parsedSrc}">`
            if (this.html) return this.html
            return _get(this.targetSize, `html`) || fallback
        },
        svgBG() {
            if (!this.parsedColor || this.parsedColor == 'transparent')
                return ''
            return `data:image/svg+xml;utf8,
                    <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'
                        x='0px' y='0px' viewBox='0 0 ${this.imageWidth} ${
                this.imageHeight
            }' xml:space='preserve'>
                        <rect fill='${this.parsedColor}' width='${
                this.imageWidth
            }' height='${this.imageHeight}' />
                    </svg>`.replace(/\r?\n|\r/g, '')
        },
        parsedPoster() {
            if (!this.poster) {
                return false
            }
            return this.poster && this.poster.length
                ? this.poster
                : this.parsedSrc
        }
    }
}
</script>

<style lang="scss">
.rsp-image-module {
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    width: 100%;

    .image-sizer {
        transition: opacity 0.6s ease;
        position: relative;
        overflow: hidden;
    }
    .image-sizer > * {
        position: absolute;
        object-fit: cover;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }

    // when set to contain
    &.fit-contain .image-sizer > * {
        object-fit: contain;
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
        left: 0;
        top: 0;
    }

    // loading state
    &.loading .image-sizer {
        opacity: 0;
    }
}
</style>
