import { shallowMount,mount } from '@vue/test-utils'
import QuickLoadmore from '../src/VueQuickLoadmore.vue'
import {expect} from 'chai'


describe('QuickLoadmore', () => {
  it('renders a div', () => {
    const wrapper = mount(QuickLoadmore, {
      attachToDocument: true
    })
    expect(wrapper.contains('div')).to.be.true
  });

  it('receive props', () => {
    const wrapper = mount(QuickLoadmore, {
      propsData: {
        topDistance: 50
      }
    })
    expect(wrapper.props().topDistance).to.eql(50)
  })
})
