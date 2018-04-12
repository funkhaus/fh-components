<template>
    <router-link
        v-if="isRelative"
        :class="['anchor-div', `a-${ replaceWith }`]"
        :to="href"
        :href="href">
        <slot />
    </router-link>

    <a
        v-else-if="href"
        :class="['anchor-div', `a-${ replaceWith }`]"
        :href="href"
        :target="newWindow ? '_blank' : null"
        :rel="newWindow ? 'noopener noreferrer' : null"
        >
        <slot />
    </a>

    <component
        :is="replaceWith"
        v-else
        :class="['anchor-div', `a-${ replaceWith }`]"
        >
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
        }
    },
    computed: {
        isRelative() {
            return this.href && String(this.href).indexOf('/') === 0
        }
    }
}
</script>
