import SplitText from '../split-text'
import { mount } from '@vue/test-utils'
import tap from 'tap'

// mount component
let wrapper = mount(SplitText, {
    slots: {
        before: '<h1>Before</h1>',
        after: '<h1>After</h1>'
    }
})

tap.test('Split Text', t => {

    t.ok(wrapper.findAll('h1').length == 2, 'Slots render correctly')

    t.ok(wrapper.is('span'), 'Wraps split lines in <span> by default')

    wrapper.setProps({ wrapper: 'div' })
    t.ok(wrapper.is('div'), 'Wraps in custom element when specified')

    // &#8211; is the em dash character
    wrapper.setProps({ text: 'First &#8211; Second' })
    t.ok(wrapper.findAll('span').length == 2, 'Splits text correctly')

    wrapper.setProps({ pieces: 1 })
    t.ok(wrapper.find('span').text() == 'Second', 'Returns specified piece')

    wrapper.setProps({ pieces: -1, separator: '@' })
    t.ok(wrapper.findAll('span').length == 1, 'Recognizes custom separator')

    wrapper.setProps({
        text: 'Text split by space, creating six h3s',
        separator: ' ',
        elements: ['h2', 'h3']
    })
    t.ok(wrapper.findAll('h3').length == 6, 'Loops on final element when there are more matches than elements')

    t.end()
})
