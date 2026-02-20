import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import LevelMenu from '@/components/LevelMenu.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('LevelMenu', () => {
  function createWrapper(storeState = {}) {
    const store = new Vuex.Store({
      state: {
        nightModeBool: false,
        ...storeState
      }
    })
    const mockRouter = { push: jest.fn() }
    return {
      wrapper: shallowMount(LevelMenu, {
        localVue,
        store,
        mocks: { $router: mockRouter },
        stubs: {
          'b-button': { template: '<button @click="$listeners.click && $listeners.click()"><slot/></button>', props: ['id'] },
          'b-popover': true
        }
      }),
      mockRouter
    }
  }

  it('renders 3 level buttons', () => {
    const { wrapper } = createWrapper()
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(3)
  })

  it('has levels 1, 2, 3 in data', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.vm.levels).toEqual([1, 2, 3])
  })

  it('navigates to level on button click', () => {
    const { wrapper, mockRouter } = createWrapper()
    const buttons = wrapper.findAll('button')
    buttons.at(0).trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith('/level/1')
  })

  it('maps nightModeBool from store', () => {
    const { wrapper } = createWrapper({ nightModeBool: true })
    expect(wrapper.vm.nightModeBool).toBe(true)
  })

  it('displays CHOOSE A LEVEL text', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain('CHOOSE A LEVEL')
  })
})
