import SplitText from '../split-text'
import { mount } from '@vue/test-utils'
import assert from 'assert'

// create fresh instance on component
let wrapper = () => {
    return mount(SplitText, {
        slots: {
            before: '<h1>Before</h1>',
            after: '<h1>After</h1>'
        }
    })
}

describe('Split Text', () => {
    it('Has before and after slots', () => {
        assert.ok(wrapper().findAll('h1').length == 2)
    })

    it('Wraps split lines in <span> by default', () => {
        assert.ok(wrapper().is('span'))
    })

    it('Wraps in custom element when specified', () => {
        const cmp = wrapper()
        cmp.setProps({ wrapper: 'div' })
        assert.ok(cmp.is('div'))
    })

    it('Splits text correctly', () => {
        // &#8211; is the em dash character
        const cmp = wrapper()
        cmp.setProps({ wrapper: 'div', text: 'First &#8211; Second' })
        assert.ok(cmp.findAll('span').length == 2)
    })

    it('Correctly renders only specified piece', () => {
        const cmp = wrapper()
        cmp.setProps({
            wrapper: 'div',
            text: 'First &#8211; Second',
            pieces: 1
        })
        assert.ok(cmp.find('span').text() == 'Second')
    })

    it('Recognizes custom separator', () => {
        const cmp = wrapper()
        cmp.setProps({ wrapper: 'div', separator: '@' })
        assert.ok(cmp.findAll('span').length == 1)
    })

    it('Loops on final element when there are more matches than elements', () => {
        const cmp = wrapper()
        cmp.setProps({
            text: 'Text split by space, creating six h3s',
            separator: ' ',
            elements: ['h2', 'h3']
        })
        assert.ok(cmp.findAll('h3').length == 6)
    })

    it('Returns the results of the first successful separator when separator set to array (first entry in array succeeds)', () => {
        const cmp = wrapper()
        cmp.setProps({
            wrapper: 'div',
            separator: ['xyz', ' - '],
            text: 'Two xyz - matches - here',
            elements: 'span'
        })
        assert.ok(cmp.findAll('span').length == 2)
    })

    it('Returns the results of the first successful separator when separator set to array (second entry in array succeeds)', () => {
        const cmp = wrapper()
        cmp.setProps({
            wrapper: 'div',
            separator: ['xyz', ' - '],
            text: 'Three - matches - here'
        })
        assert.ok(cmp.findAll('span').length == 3)
    })

    it('Returns full string when no separators in array match', () => {
        const cmp = wrapper()
        cmp.setProps({
            wrapper: 'div',
            separator: ['xyz', '@'],
            text: 'No - matches - here'
        })
        assert.ok(cmp.findAll('span').length == 1)
    })
})
