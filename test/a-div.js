import ADiv from '../a-div'
import { mount } from '@vue/test-utils'
import assert from 'assert'

// mount component
let wrapper = mount(ADiv)

describe('a-div', () => {

    it('Renders an empty div if nothing provided', () => {
        assert.ok(wrapper.is('div'))
    })

    it('Renders <router-link> if relative URL provided', () => {
        wrapper.setProps({ href: '/relative-path' })
        assert.ok(wrapper.is('router-link'))
    })

    it('Renders <a> if absolute URL provided', () => {
        wrapper.setProps({ href: 'https://absolute-path.com' })
        assert.ok(wrapper.is('a'))
    })

    it('Sets target="_blank" on new-window links', () => {
        assert.ok(wrapper.attributes().target == '_blank')
    })

    it('Sets rel="noopener noreferrer" on new-window links', () => {
        assert.ok(wrapper.attributes().rel == 'noopener noreferrer')
    })

    it('Does not set target="_blank" on same-window links', () => {
        wrapper.setProps({ newWindow: false })
        assert.notEqual(wrapper.attributes().target, '_blank')
    })

    it('Does not set rel="noopener noreferrer" on same-window links', () => {
        assert.notEqual(wrapper.attributes().rel, 'noopener noreferrer')
    })

    it('Respect replace-with value when no href provided', () => {
        wrapper.setProps({ replaceWith: 'span', href: '' })
        assert.ok(wrapper.is('span'))
    })

    it('Respects class name when no href provided', () => {
        assert.ok(wrapper.classes().includes('a-span'))
    })

    it('Respects class name when href provided', () => {
        wrapper.setProps({ href: '/any-link' })
        assert.ok(wrapper.classes().includes('a-span'))
    })

})
