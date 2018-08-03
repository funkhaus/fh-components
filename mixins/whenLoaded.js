// PROBLEM: we're running mounted() on a page
// where data may or may not have arrived yet

// SOLUTION: we'll provide a method that will
// check once immediately and then check again when page data changes
import _get from 'lodash/get'
import Vue from 'vue'

export default {
    data() {
        return {
            awaitedItem: null,
            awaitedItemCallback: null,
            awaitedItemCallbackCompleted: false
        }
    },
    methods: {
        waitFor(item, callback, resetCompleted = true) {
            this.awaitedItem = item
            this.awaitedItemCallback = callback
            this.awaitedItemCallbackCompleted = resetCompleted
                ? false
                : this.awaitedItemCallbackCompleted

            this.checkStatus()
        },
        checkStatus() {
            // don't check if we're still loading or we've already run the callback
            if (
                this.$store.getters.loading ||
                this.awaitedItemCallbackCompleted
            ) {
                return
            }

            const result = _get(this, this.awaitedItem, null)
            if (result !== null) {
                // run the callback
                this.awaitedItemCallback(result)
                this.awaitedItemCallbackCompleted = true
            }
        }
    },
    watch: {
        async '$store.getters.post'(newVal) {
            if (!newVal) return

            // check on nextTick so content has a chance to render
            await Vue.nextTick()
            this.checkStatus()
        }
    }
}
