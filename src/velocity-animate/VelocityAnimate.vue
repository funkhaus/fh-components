<template>

    <transition :css="false" @enter="enter" appear>
        <component :is="wrapper" class="velocity-animate">
            <slot/>
        </component>
    </transition>

</template>

<script>
import Velocity from 'velocity-animate'
require('velocity-animate/velocity.ui')

// list of valid transform functions from https://developer.mozilla.org/en-US/docs/Web/CSS/transform
// (combine translateX, translateY, etc to single value)
const transformFunctions = [
    'matrix',
    'translate',
    'scale',
    'rotate',
    'skew',
    'perspective'
]

export default {
    data(){
        return {
            modifiedElements: []
        }
    },
    props: {
        wrapper: {
            type: String,
            default: 'div'
        },
        sequence: {
            type: Array,
            default: () => []
        },
        reset: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        slotContents(){
            return this.$slots.default
        },
        cmpSeq(){
            // the computed sequence - this will be passed to Velocity.RunSequence
            return this.sequence.map(step => {
                const output = {}

                if( typeof step.e == 'string' ){
                    output.e = this.getElFromRefString(step.e) || step.e
                } else {
                    // handle any other refs
                    output.e = step.e
                }

                this.modifiedElements.push(step.e)

                // set initial css property states
                // for all arrays in sequence, force the prop to match the starting state
                const properties = Object.keys(step.p)

                // velocity handles transforms differently than css does, so let's get ready to aggregate
                const transform = []

                properties.map(property => {

                    // cancel if we're not an array - ie, if we have no defined starting state
                    if( !Array.isArray(step.p[property]) ){
                        return
                    }

                    // save the starting value
                    const startingValue = step.p[property][1]

                    if( transformFunctions.some( singleTransformFunction => property.indexOf(singleTransformFunction) >= 0 ) ){

                        // if we're a transform property, add to transform aggregate
                        transform.push([property, startingValue])

                    } else {

                        // set the starting state
                        output.e.style[property] = startingValue

                    }

                    // create and apply the transform aggregate
                    if( transform.length ){
                        // change 2-item arrays to strings
                        const strings = transform.map( single => `${ single[0] }(${ single[1] })` )
                        output.e.style.transform = strings.join(' ')
                    }
                })

                // set properties
                output.p = step.p

                // set options
                output.o = step.o

                return output
            })
        }
    },
    methods: {
        enter(el, done){
            // save a copy of the computed sequence, since we'll be modifying it
            const seq = this.cmpSeq

            // exit early
            if( !seq.length ){
                done()
                return
            }

            if( seq[seq.length - 1].o.complete ){
                // if we have a `complete` callback on the last element, create a dummy sequence step so we don't override the given one
                seq.push({ e: this.$el, p: { opacity: 1 }, o: { duration: 0, complete: () => this.animationComplete(done) } })
            } else {
                // otherwise, add the Vue done() callback
                seq[seq.length - 1].o.complete = () => this.animationComplete(done)
            }

            // run the sequence!
            Velocity.RunSequence(seq)
        },
        animationComplete(done){

            if( this.reset ){
                // reset elements
                this.modifiedElements.map(refString => {
                    const el = this.getElFromRefString(refString)
                    console.log(el)
                    if( !el ){
                        return
                    }
                    el.style = ''
                })
            }

            // call the Vue done() callback
            done()
        },
        getElFromRefString(ref){
            // try to find a ref that matches the string
            const match = this.slotContents.find(el => el.data && el.data.ref == ref)
            // try to find that ref's element
            return match && match.elm ? match.elm : false
        }
    }
}

</script>
