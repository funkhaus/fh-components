import ResponsiveImage from '../responsive-image'
import { mount } from '@vue/test-utils'
import assert from 'assert'

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

describe('Responsive Image', () => {

    it('Does not render an image if nothing provided', () => {
        assert.equal(mount(ResponsiveImage).contains('.image-sizer'), false)
    })

    it('Contains img with only src provided', () => {
        const wrapper = mount(ResponsiveImage)
        wrapper.setProps({ src: 'image.gif' })
        assert.ok(wrapper.html().includes('<img'), )
    })

    it('Has correct padding when aspect forced', () => {
        const wrapper = mount(ResponsiveImage)
        wrapper.setProps({ src: 'image.gif', aspect: 60 })
        assert.equal(wrapper.find('.image-sizer').element.style.paddingBottom, '60%')
    })

    it('Calculates correct aspect from height and width', () => {
        const wrapper = mount(ResponsiveImage)
        wrapper.setProps({
            src: 'image.gif',
            height: 50,
            width: 100,
            aspect: ''
        })
        assert.equal(wrapper.find('.image-sizer').element.style.paddingBottom, '50%')
    })

    it('Contains video tag when a video-src is provided', () => {
        const wrapper = mount(ResponsiveImage)
        wrapper.setProps({ src: 'image.gif', videoSrc: 'video.mp4' })
        assert.ok(wrapper.html().includes('<video'))
    })

    it('Calculates correct aspect from image object', () => {
        const wrapper = mount(ResponsiveImage)
        wrapper.setProps({ object: imageObject })
        assert.equal(wrapper.find('.image-sizer').element.style.paddingBottom, '100%')
    })

    it('Renders an image from object even when specified size in not available', () => {
        const wrapper = mount(ResponsiveImage)
        wrapper.setProps({ object: imageObject, size: 'medium' })
        assert.ok(wrapper.html().includes('<img'), )
    })

})
