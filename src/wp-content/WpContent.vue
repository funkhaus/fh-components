<script>
    import Vue from 'vue'

    export default {
        name: 'wp-content',
        props: {
            html: {
                type: String,
                default: ``
            }
        },
        computed: {
            htmlTemplate () {
                if ( !this.html ) return `<div class="wp-content-placeholder"></div>`
                return `<div class="wp-content-rendered">${ this.html }</div>`
            }
        },
        render (h, context) {
            return h({ template: this.htmlTemplate })
        }
    }

</script>
