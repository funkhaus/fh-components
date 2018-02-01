<template>
    <li :class="{ active: isActive, 'in-active-tree': isAncestor }">

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

        <ul v-if="item.children.length">
            <menu-item
                v-for="(child, index) in item.children"
                :key="index"
                :item="child"/>
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
