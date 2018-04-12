import SlideShow from '../slide-show'
import { mount } from '@vue/test-utils'
import assert from 'assert'

// create fresh instance of component
const getWrapper = (props = {}, slots = {}) => {
    const wrapper = mount(SlideShow, { slots })
    wrapper.setProps(props)
    return wrapper
}

describe('Slideshow', () => {
    it('Renders a div as the base element.', () => {
        assert.ok(getWrapper().is('div'))
    })

    it('Renders empty if no data provided.', () => {
        assert.equal(getWrapper().element.querySelectorAll('*').length, 0)
    })

    it('Renders with empty class if no data provided.', () => {
        assert.equal(getWrapper().findAll('.fh-slideshow.empty').length, 1)
    })

    it('Renders both nav slots correctly.', () => {
        const wrapper = getWrapper(
            { slides: [1, 2, 3] },
            {
                'nav-next': '<strong />',
                'nav-prev': '<em />'
            }
        )
        assert.ok(wrapper.contains('.nav.next strong'))
        assert.ok(wrapper.contains('.nav.prev em'))
    })

    it('Attaches next handler to nav next.', () => {
        const wrapper = getWrapper({ slides: [1, 2, 3] })
        wrapper.find('.nav.next').trigger('click')

        // advanced from index 0 to 1
        assert.equal(wrapper.vm.activeIndex, 1)
    })

    it('Attaches prev handler to nav prev.', () => {
        const wrapper = getWrapper({ slides: [1, 2, 3] })
        wrapper.find('.nav.prev').trigger('click')

        // went backwards from index 0 to 2 (looping)
        assert.equal(wrapper.vm.activeIndex, 2)
    })

    it('Loops by default.', () => {
        const wrapper = getWrapper({ slides: [1, 2] })
        wrapper.vm.next()
        wrapper.vm.next()

        // started at 0, went around the loop
        assert.equal(wrapper.vm.activeIndex, 0)
    })
})
