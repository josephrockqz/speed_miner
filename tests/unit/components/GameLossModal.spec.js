import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import GameLossModal from '@/components/GameLossModal.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('GameLossModal', () => {
  function createWrapper(storeState = {}) {
    const actions = {
      closeGameLossModal: jest.fn()
    }
    const store = new Vuex.Store({
      state: {
        gameLossModalBool: true,
        ...storeState
      },
      actions
    })
    const wrapper = shallowMount(GameLossModal, {
      localVue,
      store,
      stubs: { 'b-modal': { template: '<div><slot/></div>' } }
    })
    return { wrapper, actions }
  }

  it('maps gameLossModalBool from store', () => {
    const { wrapper } = createWrapper({ gameLossModalBool: true })
    expect(wrapper.vm.gameLossModalBool).toBe(true)
  })

  it('maps gameLossModalBool false state', () => {
    const { wrapper } = createWrapper({ gameLossModalBool: false })
    expect(wrapper.vm.gameLossModalBool).toBe(false)
  })

  it('has closeGameLossModal method', () => {
    const { wrapper } = createWrapper()
    expect(typeof wrapper.vm.closeGameLossModal).toBe('function')
  })

  it('renders okay button', () => {
    const { wrapper } = createWrapper()
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Okay')
  })
})
