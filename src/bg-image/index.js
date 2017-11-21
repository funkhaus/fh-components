import BgImage from './BgImage.vue'

const install = (Vue) => {
    if (install.installed) return
    Vue.component(BgImage.name, BgImage)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

const version = '1.0.0'
export default install
