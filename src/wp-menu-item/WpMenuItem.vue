<template>
    <li :class="{ active: isActive, 'in-active-tree': isAncestor }">

        <slot>
            <a
                v-if="item.is_external"
                :href="item.permalink"
                target="_blank"
                v-html="item.title"
            />

            <router-link
                v-else
                :to="item.relativePath"
                v-html="item.title"
            />
        </slot>

        <ul v-if="children.length">
            <menu-item
                v-for="(child, i) in children"
                :item="child"
                :key="i"
            >
                <slot />
            </menu-item>
        </ul>

    </li>
</template>

<script>

export default {
    props: {
        item: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    computed: {
        children () {
            return this.item.children || []
        },
        isActive(){
            return this.$route.path.replace(/\/*$/, '') == this.item.relativePath
        },
        isAncestor(){
            return this.item.relativePath.length > 1
                && !this.isActive
                && this.$route.path.includes( this.item.relativePath )
        }
    }
}

</script>
