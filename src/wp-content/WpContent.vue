<script>

    import Vue from 'vue'

    const unwrap = el => {
        // get the element's parent node
        var parent = el.parentNode
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
                type: Array,
                default: () => ['p > img', 'p > iframe']
            },
            replace: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            htmlTemplate () {
                // no html to render
                if ( !this.html ) return `<div class="wp-content-placeholder"></div>`

                // bypass unwrap queue if queue is empty
                if ( !this.unwrap.length ) return `<div class="wp-content-rendered">${ this.html }</div>`

                // phantom container to parse HTML
                const phantom = document.createElement('div')
                phantom.innerHTML = this.html

                // unwrap media
                this.unwrap.map(selector => {
                    const matches = [...phantom.querySelectorAll(selector)]
                    matches.map(match => unwrap(match.parentNode))
                })

                // replace desired elements
                this.replace.map(({ selector, callback }) => {
                    const matches = [...phantom.querySelectorAll(selector)]
                    matches.map(match => {
                        let newEl = callback ? callback(match) : null
                        if( newEl ){
                            // convert to node if we received a string
                            if( typeof newEl == 'string' ){
                                const temp = document.createElement('div')
                                temp.innerHTML = newEl
                                newEl = temp.firstChild
                            }

                            // replace old element with new one
                            match.parentNode.replaceChild(newEl, match)
                        }
                    })
                })

                return `<div class="wp-content-rendered">${ phantom.innerHTML }</div>`
            }
        },
        render (h, context) {
            return h({ template: this.htmlTemplate })
        }
    }

</script>
