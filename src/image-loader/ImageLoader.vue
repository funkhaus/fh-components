<template>
    <!-- preload images -->
    <div class="image-loader" aria-hidden="true">

        <img
            v-for="(img, i) in images"
            :key="i"
            style="display: none;"
            class="ignored-preloaded-image"
            :src="getSource(img)" />

    </div>
</template>

<script>
import _get from 'lodash/get'

export default {
    props: {
        images: {
            type: Array,
            default: () => []
        },
        size: {
            type: String,
            default: 'full'
        }
    },
    methods: {
        getSource(img) {
            // if it's a string, treat it as a URL
            if (typeof img == 'string') return img

            // otherwise, treat it as a Rest-Easy serialized image
            return _get(img, `sizes[${this.size}].url`, '')
        }
    }
}
</script>
