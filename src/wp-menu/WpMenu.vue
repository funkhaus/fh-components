<template>
    <ul :class="['menu', slug]">
        <menu-item
            v-for="(item, i) in menuItems"
            :key="i"
            :item="item"/>
    </ul>
</template>

<script>
    export default {
        props: {
            slug: {
                type: String,
                default: 'main-menu'
            }
        },
        components: {
            'menu-item': require('../wp-menu-item/WpMenuItem.vue').default
        },
        computed: {
            menuItems () {
                // find first menu that matches the given slug
                let menu = this.$store.state.site.menus.find( singleMenu => {
                    return singleMenu.slug == this.slug
                } )

                // fall back to first menu
                if( menu === undefined ){
                    menu = this.$store.state.site.menus[0]
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
