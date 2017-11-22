import FlexText from './FlexText.vue'

const install = (Vue) => {
    if (install.installed) return
    Vue.component(FlexText.name, FlexText)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

const version = '1.0.0'
export default install
