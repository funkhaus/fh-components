<script>
import fitvids from 'fitvids'
import Vue from 'vue'

const unwrap = el => {
    // get the element's parent node
    var parent = el.parentNode
    // cancel if no parent
    if (!parent) return
    // move all children out of the element
    while (el.firstChild) parent.insertBefore(el.firstChild, el)
    // remove the empty element
    parent.removeChild(el)
}

export default {
    name: 'wp-content',
    props: {
        html: {
            type: String,
            default: ``
        },
        unwrap: {
            type: [String, Array, Boolean],
            default: () => ['p > img', 'p > iframe']
        },
        replace: {
            type: Array,
            default: () => []
        },
        fitvids: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        this.runFitvids()
    },
    watch: {
        htmlTemplate() {
            this.runFitvids()
        }
    },
    computed: {
        unwrapItems() {
            if (typeof this.unwrap == 'string') return [this.unwrap]
            return this.unwrap
        },
        htmlTemplate() {
            // no html to render
            if (!this.html)
                return `<div class="wp-content wp-content-placeholder"></div>`

            // bypass unwrap queue if queue is empty
            if (!this.unwrap || !this.unwrapItems.length) {
                return `<div class="wp-content wp-content-rendered">${
                    this.html
                }</div>`
            }

            // phantom container to parse HTML
            const phantom = document.createElement('div')
            phantom.innerHTML = this.html

            // unwrap media
            this.unwrapItems.map(selector => {
                const matches = [...phantom.querySelectorAll(selector)]
                matches.map(match => unwrap(match.parentNode))
            })

            // replace desired elements
            this.replace.map(({ selector, callback }) => {
                const matches = [...phantom.querySelectorAll(selector)]
                matches.map(match => {
                    let newEl = callback ? callback(match) : null
                    if (newEl) {
                        // convert to node if we received a string
                        if (typeof newEl == 'string') {
                            const temp = document.createElement('div')
                            temp.innerHTML = newEl
                            newEl = temp.firstChild
                        }

                        // replace old element with new one
                        match.parentNode.replaceChild(newEl, match)
                    }
                })
            })

            return `<div class="wp-content wp-content-rendered">${
                phantom.innerHTML
            }</div>`
        }
    },
    methods: {
        async runFitvids() {
            if (!this.fitvids) return
            await Vue.nextTick()
            fitvids('.wp-content')
        }
    },
    render(h, context) {
        return h({ template: this.htmlTemplate })
    }
}
</script>
