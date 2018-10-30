<template>
    <li :class="classes">

        <slot>
            <a
                v-if="item.is_external"
                :href="item.permalink | removeTrailingSlash"
                target="_blank"
                v-html="item.title"
            />

            <router-link
                v-else
                :to="item.relativePath | removeTrailingSlash"
                v-html="item.title"
            />

            <ul v-if="children.length">
                <menu-item
                    v-for="(child, i) in children"
                    :item="child"
                    :key="i"
                />
            </ul>
        </slot>

    </li>
</template>

<script>
export default {
    name: 'menu-item',
    filters: {
        removeTrailingSlash(val) {
            return val == '/' ? val : val.replace(/\/$/, '')
        }
    },
    props: {
        item: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    computed: {
        children() {
            return this.item.children || []
        },
        isActive() {
            return (
                this.$route.path.replace(/\/*$/, '') == this.item.relativePath
            )
        },
        isParent() {
            // remove trailing slash
            const strippedSlash = this.$route.path.replace(/\/$/g, '')
            // remove last directory from current route
            const parentRoute = strippedSlash.replace(/\/[^\/]*$/g, '')
            return parentRoute == this.item.relativePath
        },
        isAncestor() {
            return (
                (!this.isActive &&
                    this.$route.path.includes(this.item.relativePath)) ||
                this.isParent ||
                this.item.relativePath == '/'
            )
        },
        hasSubMenu() {
            return Object.keys(this.item.children).length > 0
        },
        isFrontPage() {
            return this.item.relativePath == '/'
        },
        classes() {
            const classes = [
                'menu-item',
                `menu-item-${this.item.ID || 'none'}`,
                { 'menu-item-has-children': this.hasSubMenu },
                { 'current-menu-item': this.isActive },
                { 'current-menu-parent': this.isParent },
                { 'current-menu-ancestor': this.isAncestor },
                { 'menu-item-is-front-page': this.isFrontPage },
                { 'in-active-tree': this.isAncestor },
                { active: this.isActive },
                { 'menu-item-is-home': this.item.isHome }
            ]

            // if devId has been provided, add it
            if (this.item.devId !== undefined) {
                classes.push(`menu-item-dev-id-${this.item.devId}`)
            }

            return classes
        }
    }
}
</script>
