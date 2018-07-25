<template>
    <div :class="classes" :style="outerStyles">

        <div
            v-if="parsedVideoSrc"
            class="image-sizer"
            :style="sizerStyles"
        >
            <video
                :src="parsedVideoSrc"
                @ended="$emit('ended', $event)"
                autoplay
                :loop="loop"
                playsinline
                :muted="volume <= 0"
                :poster="parsedPoster"
            />
        </div>
        <div
            v-else-if="parsedSrc || html"
            class="image-sizer"
            :style="sizerStyles"
            v-html="innerHtml"
            ref="imageWrap"
        />
        <slot />

    </div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
import _clamp from 'lodash/clamp'
import _get from 'lodash/get'
import Vue from 'vue'

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
        'video-src': [String, Boolean],
        size: {
            type: String,
            default: 'full'
        },
        color: {
            type: String,
            default: ''
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
            type: [String, Boolean],
            default: ''
        },
        volume: {
            type: Number,
            default: 0
        },
        loop: {
            type: Boolean,
            default: true
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
        },
        innerHtml() {
            this.setMediaClass()
            this.setFocalPoint()
        },
        volume() {
            this.setVolume()
        }
    },
    async mounted() {
        this.setMediaClass()
        this.setVolume()

        // make sure the wrapped image is rendered
        await Vue.nextTick()

        // set focal point
        this.setFocalPoint()
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
        setFocalPoint() {
            // find the wrapped image
            if (
                this.$refs.imageWrap &&
                this.$refs.imageWrap.querySelector('*')
            ) {
                const wrapped = this.$refs.imageWrap.querySelector('*')

                // set its position (default: 50% 50%)
                wrapped.style.objectPosition = `${this.parsedFocus.x}% ${
                    this.parsedFocus.y
                }%`
            }
        },
        setMediaClass() {
            // give the "media" class to whatever we are rendering (img or video)
            if (!this.$el || !this.$el.querySelector) return
            Vue.nextTick(() => {
                const media = this.$el.querySelector('.image-sizer > *')
                if (media) media.classList.add('media')
            })
        },
        setObjectDimensions() {
            if (this.object) {
                this.imageWidth = _get(this.targetSize, `width`)
                this.imageHeight = _get(this.targetSize, `height`)
            }
        },
        async setVolume() {
            await Vue.nextTick()

            const video = this.$el.querySelector('video')
            if (video) {
                video.volume = _clamp(this.volume, 0, 1)
            }
        }
    },
    computed: {
        aspectPadding() {
            // default to defined aspect, or calculate
            const calculatedAspect = this.parsedHeight / this.parsedWidth * 100
            return this.aspect || calculatedAspect || 56.25
        },
        classes() {
            return [
                'rsp-image-module',
                'responsive-image',
                `fit-${this.fit}`,
                { loading: this.loading },
                { 'fill-space': this.fillSpace },
                { 'has-video': this.parsedVideoSrc }
            ]
        },
        imageTag() {
            // TODO: Add other img attributes
            const fallback = `<img src="${this.parsedSrc}" alt="${
                this.parsedAlt
            }">`
            if (this.html) return this.html
            return _get(this.targetSize, `html`) || fallback
        },
        innerHtml() {
            return this.imageTag || ''
        },
        isAcf() {
            // check to see if this is an ACF-serialized object
            // search for the existence of keys that ACF objects have but Rest-Easy ones don't
            return (
                this.object.hasOwnProperty('filesize') &&
                this.object.hasOwnProperty('mime_type') &&
                this.object.hasOwnProperty('modified')
            )
        },
        outerStyles() {
            const styles = {}

            // set max dims if needed
            if (this['respect-max']) {
                styles['max-width'] = `${this.parsedWidth}px`
                styles['max-height'] = `${this.parsedHeight}px`
            }

            // add color bg if needed
            if (
                this.parsedColor &&
                this.parsedColor !== 'transparent' &&
                this.loading
            ) {
                // set color or SVG background depending on settings
                if (this.fit == 'cover')
                    styles['background-color'] = this.parsedColor
                else styles['background-image'] = `url("${this.svgBG}")`

                // set fit
                styles['background-size'] = this.fit
            }

            return styles
        },
        parsedAlt() {
            return _get(this, 'object.alt', '')
        },
        parsedColor() {
            return (
                this.color ||
                _get(this.object, 'primary_color') ||
                'transparent'
            )
        },
        parsedFocus() {
            return _get(this, 'object.focus', { x: 50, y: 50 })
        },
        parsedHeight() {
            // default to defined height
            if (this.height) return parseInt(this.height)
            return this.imageHeight
        },
        parsedPoster() {
            if (this.poster === null) return ''
            return this.poster && this.poster.length
                ? this.poster
                : this.parsedSrc
        },
        parsedSrc() {
            // return hardcoded source if we have one
            if (this.src) return this.src

            // return ACF source if we have one (only respects fullscreen)
            if (this.isAcf) {
                return _get(this, 'object.sizes.fullscreen', '')
            }

            return _get(this.targetSize, `url`)
        },
        parsedVideoSrc() {
            const metaString =
                _get(this.object, 'meta.custom_video_url') ||
                _get(this.object, 'alt', '')
            if (this.videoSrc || this.videoSrc === null) return this.videoSrc
            else return String(metaString).includes('.mp4') ? metaString : ''
        },
        parsedWidth() {
            // default to defined width
            if (this.width) return parseInt(this.width)
            return this.imageWidth
        },
        sizerStyles() {
            if (!this.fillSpace) {
                return {
                    paddingBottom: `${this.aspectPadding}%`
                }
            }
            return {}
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
        targetSize() {
            // should return an object with { height, html, url, width }

            // return ACF sizes
            if (this.isAcf) {
                return {
                    width: _get(this, 'object.sizes.fullscreen-width', 0),
                    height: _get(this, 'object.sizes.fullscreen-height', 0),
                    url: _get(this, 'object.sizes.fullscreen', '')
                }
            }

            // get sizes from image object
            const sizes = _get(this.object, `sizes`, {})

            // get specified size, or first available size
            return (
                _get(sizes, this.size) || sizes[_get(Object.keys(sizes), '[0]')]
            )
        }
    }
}
</script>

<style lang="scss">
.rsp-image-module {
    transition: background 0.6s ease;
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
