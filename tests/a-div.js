import ADiv from '../a-div'
import { mount } from '@vue/test-utils'
import tap from 'tap'

// mount component
let wrapper = mount(ADiv)

tap.test('a-div', t => {

    t.ok(wrapper.is('div'), 'Renders an empty div if nothing provided')

    wrapper.setProps({ href: '/relative-path' })
    t.ok(wrapper.is('router-link'), 'Renders <router-link> if relative URL provided')

    wrapper.setProps({ href: 'https://absolute-path.com' })
    t.ok(wrapper.is('a'), 'Renders <a> if absolute URL provided')

    t.ok(wrapper.attributes().target == '_blank', 'target="_blank" on new-window links')
    t.ok(wrapper.attributes().rel == 'noopener noreferrer', 'rel="noopener noreferrer" on new-window links')

    wrapper.setProps({ newWindow: false })
    t.notOk(wrapper.attributes().target == '_blank', 'No target="_blank" on same-window links')
    t.notOk(wrapper.attributes().rel == 'noopener noreferrer', 'No rel="noopener noreferrer" on same-window links')

    wrapper.setProps({ replaceWith: 'span', href: '' })
    t.ok(wrapper.is('span'), 'Respect replace-with value when no href provided')
    t.ok(wrapper.classes().includes('a-span'), 'Respects class name when no href provided')
    wrapper.setProps({ href: '/any-link' })
    t.ok(wrapper.classes().includes('a-span'), 'Respects class name when href provided')

    t.end()
})
