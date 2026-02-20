import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import GamePanel from '@/components/GamePanel.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

// Stub font-awesome-icon globally
localVue.component('font-awesome-icon', { template: '<i />' })

function createWrapper(storeState = {}, props = {}) {
  const store = new Vuex.Store({
    state: {
      gameStartBool: false,
      numMinesLeft: 12,
      squaresBool: false,
      timeElapsed: 0,
      ...storeState
    },
    actions: {
      restartGame: jest.fn(),
      timeExceeded: jest.fn()
    }
  })

  return shallowMount(GamePanel, {
    localVue,
    store,
    propsData: { level: 1, ...props },
    stubs: {
      LeaveLevelModal: true,
      'b-button': { template: '<button @click="$listeners.click && $listeners.click()"><slot/></button>' }
    }
  })
}

describe('GamePanel', () => {
  describe('mineCounterDisplay', () => {
    it('pads single digit with zeros', () => {
      const wrapper = createWrapper({ numMinesLeft: 5 })
      expect(wrapper.vm.mineCounterDisplay).toBe('005')
    })

    it('pads double digit with zero', () => {
      const wrapper = createWrapper({ numMinesLeft: 42 })
      expect(wrapper.vm.mineCounterDisplay).toBe('042')
    })

    it('shows triple digit as-is', () => {
      const wrapper = createWrapper({ numMinesLeft: 123 })
      expect(wrapper.vm.mineCounterDisplay).toBe('123')
    })

    it('shows negative with leading zeros', () => {
      const wrapper = createWrapper({ numMinesLeft: -3 })
      expect(wrapper.vm.mineCounterDisplay).toBe('-03')
    })

    it('shows negative double digit', () => {
      const wrapper = createWrapper({ numMinesLeft: -12 })
      expect(wrapper.vm.mineCounterDisplay).toBe('-12')
    })

    it('shows zero as 000', () => {
      const wrapper = createWrapper({ numMinesLeft: 0 })
      expect(wrapper.vm.mineCounterDisplay).toBe('000')
    })
  })

  describe('time display', () => {
    it('shows 00X for single digit time', () => {
      const wrapper = createWrapper({ timeElapsed: 5 })
      expect(wrapper.html()).toContain('005')
    })

    it('shows 0XX for double digit time', () => {
      const wrapper = createWrapper({ timeElapsed: 42 })
      expect(wrapper.html()).toContain('042')
    })

    it('shows XXX for triple digit time', () => {
      const wrapper = createWrapper({ timeElapsed: 123 })
      expect(wrapper.html()).toContain('123')
    })
  })

  describe('openModal', () => {
    it('shows leave modal when game is active', () => {
      const wrapper = createWrapper({ squaresBool: true, gameStartBool: true })
      const mockShow = jest.fn()
      wrapper.vm.$bvModal = { show: mockShow }
      wrapper.vm.openModal()
      expect(mockShow).toHaveBeenCalledWith('leave-level-modal')
    })

    it('navigates to home when game is not active', () => {
      const mockPush = jest.fn()
      const wrapper = createWrapper({ squaresBool: false, gameStartBool: false })
      wrapper.vm.$router = { push: mockPush }
      wrapper.vm.openModal()
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  describe('timeElapsed watcher', () => {
    it('dispatches timeExceeded when time > 999', async () => {
      const timeExceeded = jest.fn()
      const store = new Vuex.Store({
        state: { gameStartBool: false, numMinesLeft: 12, squaresBool: false, timeElapsed: 999 },
        actions: { restartGame: jest.fn(), timeExceeded }
      })
      const wrapper = shallowMount(GamePanel, {
        localVue,
        store,
        propsData: { level: 2 },
        stubs: { LeaveLevelModal: true, 'b-button': true }
      })
      store.state.timeElapsed = 1000
      await wrapper.vm.$nextTick()
      expect(timeExceeded).toHaveBeenCalled()
    })
  })

  it('receives level prop', () => {
    const wrapper = createWrapper({}, { level: 3 })
    expect(wrapper.vm.level).toBe(3)
  })
})
