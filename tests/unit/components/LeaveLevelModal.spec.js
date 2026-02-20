import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import LeaveLevelModal from '@/components/LeaveLevelModal.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('LeaveLevelModal', () => {
  function createWrapper() {
    const actions = {
      restartGame: jest.fn()
    }
    const store = new Vuex.Store({
      state: {},
      actions
    })
    const mockRouter = { push: jest.fn() }
    const mockBvModal = { hide: jest.fn() }
    const wrapper = shallowMount(LeaveLevelModal, {
      localVue,
      store,
      stubs: { 'b-modal': { template: '<div><slot/></div>' } },
      mocks: {
        $router: mockRouter,
        $bvModal: mockBvModal
      }
    })
    return { wrapper, actions, mockRouter, mockBvModal }
  }

  it('cancel hides the modal', () => {
    const { wrapper, mockBvModal } = createWrapper()
    wrapper.vm.cancel()
    expect(mockBvModal.hide).toHaveBeenCalledWith('leave-level-modal')
  })

  it('leaveLevel navigates to home and restarts game', async () => {
    const { wrapper, actions, mockRouter } = createWrapper()
    await wrapper.vm.leaveLevel()
    expect(mockRouter.push).toHaveBeenCalledWith('/')
    expect(actions.restartGame).toHaveBeenCalled()
  })

  it('renders cancel and yes buttons', () => {
    const { wrapper } = createWrapper()
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(2)
    expect(buttons.at(0).text()).toBe('Cancel')
    expect(buttons.at(1).text()).toBe('Yes')
  })

  it('renders progress warning text', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain('Progress will not be saved')
  })
})
