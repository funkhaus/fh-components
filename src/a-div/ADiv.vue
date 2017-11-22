<template>
    <router-link
        v-if="isRelative"
        class="anchor-div"
        :to="href"
        :href="href">
        <slot />
    </router-link>

    <a
        v-else-if="href"
        class="anchor-div"
        :href="href"
        :target="newWindow ? '_blank' : null"
        :rel="newWindow ? 'noopener noreferrer' : null"
        >
        <slot />
    </a>

    <div v-else class="anchor-div">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'a-div',
    props: {
        href: String,
        'new-window': {
            type: Boolean,
            default: true
        }
    },
    computed: {
        isRelative () {
            return this.href && String(this.href).indexOf('/') === 0
        }
    }
}
</script>
