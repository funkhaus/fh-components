<template>
    <ul :class="['menu', targetSlug]">
        <menu-item
            v-for="(item, i) in menuItems"
            :key="i"
            :item="item"
        >
            <slot name="menu-item" :menu-item="item" :index="i" />
        </menu-item>
    </ul>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'

export default {
    props: {
        slug: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: 'Main Menu'
        }
    },
    components: {
        'menu-item': require('../wp-menu-item/WpMenuItem.vue')
    },
    computed: {
        targetSlug() {
            return this.slug || _kebabCase(this.name)
        },
        menuItems() {
            const menus = _get(this.$store.state, 'site.menus', [])

            // find first menu that matches the given slug
            let menu = menus.find(singleMenu => {
                return singleMenu.slug == this.targetSlug
            })

            // fall back to first menu
            if (menu === undefined) {
                menu = _get(menus, '[0]')
            }

            return menu ? menu.items : false
        }
    }
}
</script>

<style>
.menu {
    list-style-type: none;
    padding: 0;
    margin: 0;
}
</style>
