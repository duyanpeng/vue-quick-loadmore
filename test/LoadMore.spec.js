import { shallowMount, mount } from '@vue/test-utils'
import Loadmore from '../src/GarenLoadmore.vue'
import chai, { expect } from 'chai'
import { createEvent } from './utils'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

describe('Loadmore', () => {
  it('pulling状态改变pulling', (done) => {
    const wrapper = mount(Loadmore, {
      propsData: {
        'top-change-text': {
          pulling: "测试下拉刷新",
          limit: "测试释放刷新",
          loading: "测试正在刷新...",
          complete: "测试完成",
        }
      }
    })
    const vm = wrapper.vm
    const touchmove = createEvent('touchmove')
    touchmove.touches = [{ screenY: 20 }]
    const content = vm.$refs.content
    vm.startPositionTop = -40
    content.addEventListener('touchmove', function (e) {
      expect(vm.topStatus).to.equal('pulling')
      expect(vm.topText).to.equal('测试下拉刷新')
      setTimeout(() => {
        expect(wrapper.emitted()['top-status-change'][0][0]).to.be.equal('pulling')
        done()
      }, 0)
    }, false);
    content.dispatchEvent(touchmove)
  })

  it('pulling状态改变limit', (done) => {
    const wrapper = mount(Loadmore, {
      propsData: {
        'top-change-text': {
          pulling: "测试下拉刷新",
          limit: "测试释放刷新",
          loading: "测试正在刷新...",
          complete: "测试完成",
        }
      }
    })
    const vm = wrapper.vm
    const touchmove = createEvent('touchmove')
    touchmove.touches = [{ screenY: 200 }]
    const content = vm.$refs.content
    content.addEventListener('touchmove', function (e) {
      expect(vm.topStatus).to.equal('limit')
      expect(vm.topText).to.equal('测试释放刷新')
      setTimeout(() => {
        expect(wrapper.emitted()['top-status-change'][0][0]).to.be.equal('limit')
        done()
      }, 0)
    }, false);
    content.dispatchEvent(touchmove)
  })

  it('pulling状态改变loading', (done) => {
    const wrapper = mount(Loadmore,
      {
        propsData: {
          'top-change-text': {
            pulling: "测试下拉刷新",
            limit: "测试释放刷新",
            loading: "测试正在刷新...",
            complete: "测试完成",
          }
        }
      })
    const vm = wrapper.vm
    const touchend = createEvent('touchend')
    touchend.changedTouches = [{ screenY: 200 }]
    const content = vm.$refs.content
    content.addEventListener('touchend', function (e) {
      expect(vm.topStatus).to.equal('loading')
      expect(vm.topText).to.equal('测试正在刷新...')
      setTimeout(() => {
        expect(wrapper.emitted()['top-status-change'][0][0]).to.be.equal('loading')
        expect(wrapper.emitted()['top-method']).to.not.be.undefined
        done()
      }, 0)
    }, false);
    content.dispatchEvent(touchend)
  })

  it('pulling状态改变complete', () => {
    const wrapper = mount(Loadmore, {
      propsData: {
        'top-change-text': {
          pulling: "测试下拉刷新",
          limit: "测试释放刷新",
          loading: "测试正在刷新...",
          complete: "测试完成",
        }
      }
    })
    const vm = wrapper.vm
    const content = vm.$refs.content
    vm.topStatus = 'loading'
    vm.onTopLoaded()
    expect(vm.topStatus).to.equal('complete')
    expect(vm.topText).to.equal('测试完成')
  })

  it('loading状态改变loading', (done) => {
    const wrapper = mount(Loadmore,
      {
        propsData: {
          'bottom-change-text': {
            loading: "测试正在加载更多...",
            nodata: "测试暂无更多数据",
            error: "测试请求数据出错，请点击重试",
          }
        }
      })
    const vm = wrapper.vm
    const scroll = createEvent('scroll')
    vm.$el.addEventListener('scroll', function (e) {
      expect(vm.bottomStatus).to.equal('loading')
      expect(vm.bottomText).to.equal('测试正在加载更多...')
      setTimeout(() => {
        expect(wrapper.emitted()['bottom-status-change'][0][0]).to.be.equal('loading')
        expect(wrapper.emitted()['bottom-method']).to.not.be.undefined
        done()
      }, 0)
    }, false);
    vm.$el.dispatchEvent(scroll)
  })

  it('loading状态改变complete', () => {
    const wrapper = mount(Loadmore,
      {
        propsData: {
          'bottom-change-text': {
            loading: "测试正在加载更多...",
            nodata: "测试暂无更多数据",
            error: "测试请求数据出错，请点击重试",
          }
        }
      })
    const vm = wrapper.vm
    vm.bottomStatus = 'loading'
    vm.onBottomLoaded()
    expect(vm.bottomStatus).to.equal('wait')
  })

  it('loading状态改变nodata', () => {
    const wrapper = mount(Loadmore,
      {
        propsData: {
          'bottom-change-text': {
            loading: "测试正在加载更多...",
            nodata: "测试暂无更多数据",
            error: "测试请求数据出错，请点击重试",
          }
        }
      })
    const vm = wrapper.vm
    vm.bottomStatus = 'loading'
    vm.onBottomLoaded(false)
    expect(vm.bottomStatus).to.equal('nodata')
  })

  it('loading状态改变error', (done) => {
    const wrapper = mount(Loadmore,
      {
        propsData: {
          'bottom-change-text': {
            loading: "测试正在加载更多...",
            nodata: "测试暂无更多数据",
            error: "测试请求数据出错，请点击重试",
          }
        }
      })
    const vm = wrapper.vm
    vm.bottomStatus = 'loading'
    vm.onBottomError()
    expect(vm.bottomStatus).to.equal('error')
    wrapper.find('.garen-loadmore-footer').trigger('click')
    setTimeout(() => {
      expect(wrapper.emitted()['bottom-error-click']).to.not.be.undefined
      done()
    }, 0)
  })

  it('loading监听scroll', (done) => {
    const cb = sinon.spy()
    const wrapper = mount(Loadmore,
      {
        propsData: {
          'event-scroll': cb
        }
      })
    const vm = wrapper.vm
    const scroll = createEvent('scroll')
    vm.$el.addEventListener('scroll', function (e) {
      setTimeout(() => {
        expect(cb).to.have.been.called
        done()
      }, 0)
    }, false);
    vm.$el.dispatchEvent(scroll)
  })

  it('loading获取滚动距离', () => {
    const wrapper = mount(Loadmore)
    const vm = wrapper.vm
    const scrollTop = vm.getScrollTop()
    expect(scrollTop).to.equal(0)
  })

  it('loading设置滚动距离', (done) => {
    const wrapper = mount(Loadmore)
    const vm = wrapper.vm
     vm.setScrollTop(50)
    setTimeout(()=>{
      // TODO: slots
      const scrollTop = vm.getScrollTop()
     // expect(scrollTop).to.equal(50)
      done()
    },0) 
  })
})
