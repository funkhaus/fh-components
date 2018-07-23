<template>
    <div :class="classes" tabindex="1">
        <slot name="before" />

        <transition
            @before-enter="$emit('before-enter', $event)"
            @enter="proxyEnter"
            @after-enter="transitioning = false; $emit('after-enter', $event)"
            @enter-cancelled="$emit('enter-cancelled', $event)"

            @before-leave="transitioning = true; $emit('before-leave', $event)"
            @leave="proxyLeave"
            @after-leave="$emit('after-leave', $event)"
            @leave-cancelled="$emit('leave-cancelled', $event)"
            :name="`${ transitionName }-${ direction }`"
            :mode="transitionMode"
            :css="css"
        >
            <slot
                v-for="(slide, i) in slides"
                v-if="activeIndex == i"
                :slide="slide"
                :index="i"
                name="slide"
            />
        </transition>

        <div
            v-if="slides.length > 1"
            class="nav next"
            @click="manualNext"
        >
            <slot name="nav-next" />
        </div>
        <div
            v-if="slides.length > 1"
            class="nav prev"
            @click="manualPrev"
        >
            <slot name="nav-prev" />
        </div>

        <div v-if="slides.length > 1 && pagination" class="pagination">
            <div
                v-for="(s, i) in slides"
                :class="['pagination-item', { active: activeIndex == i }]"
                @click="goTo(i)"
            >
                <slot name="pagination-item" :slide="s" />
            </div>
        </div>

        <slot />
    </div>
</template>

<script>
import _clamp from 'lodash/clamp'
import Hammer from 'hammerjs'
import _get from 'lodash/get'

export default {
    props: {
        // array of items to make slides out of
        slides: {
            type: Array,
            default: () => []
        },
        // determines if slideshow should be on timer
        auto: {
            type: Boolean,
            default: true
        },
        // determines if swipe should be enabled
        swipe: {
            type: Boolean,
            default: true
        },
        // controls if slideshow should return to
        // beginning after reaching the end
        loop: {
            type: Boolean,
            default: true
        },
        // if true, slideshow will continue in
        // one direction while looping
        infinite: {
            type: Boolean,
            default: true
        },
        // time between auto slides, in ms
        interval: {
            type: Number,
            default: 4000
        },
        // time to delay before initiating auto
        delay: {
            type: Number,
            default: 500
        },
        // used to manually control slide index
        // can be bidirectionally bound with .sync
        index: {
            type: [Number, Object],
            default: null
        },
        // determines if pagination items should render
        pagination: {
            type: Boolean,
            default: true
        },
        // if true, keyboard listeners will be on
        // root slideshow element rather than window
        localKeyboard: {
            type: Boolean,
            default: false
        },
        // keyCode for key to trigger next
        nextKey: {
            type: [Number, String],
            default: 39
        },
        // keyCode for key to trigger prev
        prevKey: {
            type: [Number, String],
            default: 37
        },
        // used to tell vue whether or not
        // to use css transitions
        css: {
            type: Boolean,
            default: true
        },
        // override the default transition name
        // (direction will be appended)
        transitionName: {
            type: String,
            default: 'fh-slide'
        },
        // override default transition mode
        transitionMode: {
            type: String,
            default: ''
        },
        // whether or not the user has any control over this slideshow
        canControl: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            transitioning: false,
            direction: 'next',
            internalIndex: 0,
            timer: null,
            hammertime: null,
            transitionRef: null
        }
    },
    mounted() {
        if (this.auto) this.startTimer()
        this.setKeyboardListeners()
        this.initHammer()
    },
    destroyed() {
        this.stopTimer()
        this.clearKeyboardListeners()
        if (this.hammertime) {
            this.hammertime.destroy()
        }
    },
    watch: {
        activeIndex(next, prv) {
            this.$emit('change', next)

            if (this.transitionRef == 'manual') return
            else {
                const didLoop = prv - next == this.slides.length - 1
                if (this.infinite && didLoop) {
                    return (this.direction = 'next')
                }
                // otherwise go in natural direction of indexes
                if (next > prv) this.direction = 'next'
                else this.direction = 'prev'
            }
        },
        internalIndex(idx) {
            this.$emit('update:index', idx)
        },
        localKeyboard() {
            this.setKeyboardListeners()
        },
        auto(auto) {
            if (auto) this.startTimer()
            else this.stopTimer()
        },
        interval() {
            this.stopTimer()
            this.startTimer()
        }
    },
    computed: {
        classes() {
            return [
                'fh-slideshow',
                { empty: !this.slides.length },
                { transitioning: this.transitioning },
                { 'first-slide': this.activeIndex == 0 },
                { 'last-slide': this.activeIndex == this.slides.length - 1 }
            ]
        },
        activeIndex() {
            return this.index === null
                ? this.internalIndex
                : this.clamp(this.index)
        }
    },
    methods: {
        clamp(value) {
            // clamp value within range of slides
            if (this.loop) {
                return (value + this.slides.length) % this.slides.length
            }
            return _clamp(value, 0, this.slides.length - 1)
        },
        goTo(idx) {
            this.stopTimer()
            this.internalIndex = idx
            this.$emit('manual-change', this.activeIndex)
        },
        next() {
            this.internalIndex = this.clamp(this.activeIndex + 1)
            this.$emit('next', this.activeIndex)
        },
        prev() {
            this.internalIndex = this.clamp(this.activeIndex - 1)
            this.$emit('prev', this.activeIndex)
        },
        manualNext() {
            if (!this.canControl) return

            this.stopTimer()
            if (this.infinite){
                this.transitionRef = 'manual'
                this.direction = 'next'
            }
            else {
                this.transitionRef = 'auto'
            }
            this.next()
            this.$emit('manual-next', this.activeIndex)
        },
        manualPrev() {
            if (!this.canControl) return

            this.stopTimer()
            if (this.infinite){
                this.transitionRef = 'manual'
                this.direction = 'prev'
            }
            else {
                this.transitionRef = 'auto'
            }
            this.prev()
            this.$emit('manual-prev', this.activeIndex)
        },
        startTimer() {
            // start auto timer
            setTimeout(() => {
                this.timer = setInterval(
                    () => {
                        this.transitionRef = 'auto'
                        this.next()
                    }, this.interval)
                }, this.delay)
            return this.timer
        },
        stopTimer() {
            // kill timer
            return clearInterval(this.timer)
        },
        onKeyboard(e) {
            if (e.keyCode == this.nextKey) {
                e.preventDefault()
                this.manualNext()
            }

            if (e.keyCode == this.prevKey) {
                e.preventDefault()
                this.manualPrev()
            }
        },
        clearKeyboardListeners() {
            window.removeEventListener('keydown', this.onKeyboard)
            this.$el.removeEventListener('keydown', this.onKeyboard)
        },
        setKeyboardListeners() {
            // clear legacy listeners
            this.clearKeyboardListeners()

            // set new listeners
            if (this.localKeyboard) {
                this.$el.addEventListener('keydown', this.onKeyboard)
            } else {
                window.addEventListener('keydown', this.onKeyboard)
            }
        },
        proxyEnter() {
            this.$emit('enter', ...arguments)
        },
        proxyLeave() {
            this.$emit('leave', ...arguments)
        },
        initHammer() {
            this.hammertime = new Hammer(this.$el)
            this.hammertime.on('swipeleft', () => {
                if (this.swipe) this.manualNext()
            })
            this.hammertime.on('swiperight', () => {
                if (this.swipe) this.manualPrev()
            })
        }
    }
}
</script>

<style lang="scss">
.fh-slideshow {
    position: relative;
    overflow: hidden;

    &:focus {
        outline: none;
    }
    .slide {
        position: absolute;
        height: 100%;
        width: 100%;
    }
}

// transition
.fh-slide-next-enter-active,
.fh-slide-next-leave-active,
.fh-slide-prev-enter-active,
.fh-slide-prev-leave-active {
    transition: transform 0.5s ease;
    position: absolute;
    left: 0;
    top: 0;
}
.fh-slide-next-enter,
.fh-slide-prev-leave-to {
    transform: translateX(100%);
}
.fh-slide-next-leave-to,
.fh-slide-prev-enter {
    transform: translateX(-100%);
}
</style>
