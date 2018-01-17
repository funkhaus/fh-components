import ResponsiveImage from '../responsive-image'
import { mount } from '@vue/test-utils'
import tap from 'tap'

// mount component
let wrapper = mount(ResponsiveImage)

// mock a serialized image object
const imageObject = {
    sizes: {
        full: {
            height: 960,
            width: 960,
            html: `<img width="2880" height="3833" src="image.jpg" class="attachment-full size-full" alt="" />`,
            url: 'image.jpg'
        }
    }
}

tap.test('Responsive Image', t => {

    t.notOk(wrapper.contains('.image-sizer'), 'Does not render an image if nothing provided')

    wrapper.setProps({ src: 'image.gif' })
    t.ok(wrapper.html().includes('<img'), 'Contains img with only src provided')

    wrapper.setProps({ aspect: 60 })
    t.equal(wrapper.find('.image-sizer').element.style.paddingBottom, '60%', 'Has correct padding when aspect forced')

    wrapper.setProps({ src: 'image.gif', height: 50, width: 100, aspect: '' })
    t.equal(wrapper.find('.image-sizer').element.style.paddingBottom, '50%', 'Calculates correct aspect from height and width')

    wrapper.setProps({ videoSrc: 'video.mp4' })
    t.ok(wrapper.html().includes('<video'), 'Contains video tag when a video-src is provided')

    // reset props, pass image object instead
    wrapper.setProps({ src: '', videoSrc: '', height: '', width: '', aspect: '' })
    wrapper.setProps({ object: imageObject })

    t.equal(wrapper.find('.image-sizer').element.style.paddingBottom, '100%', 'Calculates correct aspect from image object')

    wrapper.setProps({ size: 'medium' })
    t.ok(wrapper.html().includes('<img'), 'Renders an image from object even when specified size in not available')

    t.end()
})
