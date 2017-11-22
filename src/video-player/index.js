import VideoPlayer from './VideoPlayer.vue'

const install = function (Vue) {
    if (install.installed) return
    Vue.component(VideoPlayer.name, VideoPlayer)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

const version = '1.0.0'
export {
    install as default,
    version,
    VideoPlayer
}
