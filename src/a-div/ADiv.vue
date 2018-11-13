<template>
    <router-link
        v-if="isRelative"
        :class="['anchor-div', `a-${ replaceWith }`]"
        :to="href | removeOrigin">
        <slot />
    </router-link>

    <a
        v-else-if="href"
        :class="['anchor-div', `a-${ replaceWith }`]"
        :href="href"
        :target="newWindow ? '_blank' : null"
        :rel="newWindow ? 'noopener noreferrer' : null">
        <slot />
    </a>

    <component
        :is="replaceWith"
        v-else
        :class="['anchor-div', `a-${ replaceWith }`]">
        <slot />
    </component>
</template>

<script>
export default {
    name: 'a-div',
    props: {
        href: String,
        'new-window': {
            type: Boolean,
            default: true
        },
        'replace-with': {
            type: String,
            default: 'div'
        },
        'force-new': {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isRelative() {
            // return false if we're forcing an outside link
            if (this.forceNew) return false

            // return true if we start with a slash
            if (this.href && String(this.href).indexOf('/') === 0) return true

            // return true if we use the same origin
            if (this.href.startsWith(location.origin)) return true

            return false
        }
    },
    filters: {
        removeOrigin(input) {
            return input.replace(location.origin, '')
        }
    }
}
</script>
