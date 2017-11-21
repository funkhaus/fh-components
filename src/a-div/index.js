import ADiv from './ADiv.vue'

const install = (Vue) => {
    if (install.installed) return
    Vue.component(ADiv.name, ADiv)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

const version = '1.0.0'
export default install
