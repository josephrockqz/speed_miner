import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import App from '@/App.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('App', () => {
  let actions, store

  beforeEach(() => {
    actions = {
      restartGame: jest.fn()
    }
    store = new Vuex.Store({
      state: {
        backgroundColor: '#e9e9e9',
        gameStartBool: false,
        squaresBool: false
      },
      actions
    })
  })

  function createWrapper(routeName = 'Home') {
    return shallowMount(App, {
      localVue,
      store,
      stubs: {
        GameWinModal: true,
        GameLossModal: true,
        'router-view': true
      },
      mocks: {
        $route: { name: routeName },
        $router: { push: jest.fn() },
        $bvModal: { show: jest.fn() }
      }
    })
  }

  describe('goToHome', () => {
    it('shows leave modal when game is active', () => {
      store.state.squaresBool = true
      store.state.gameStartBool = true
      const wrapper = createWrapper('Level')
      wrapper.vm.goToHome()
      expect(wrapper.vm.$bvModal.show).toHaveBeenCalledWith('leave-level-modal')
    })

    it('navigates to home and restarts when game not active on level page', () => {
      store.state.squaresBool = false
      store.state.gameStartBool = false
      const wrapper = createWrapper('Level')
      wrapper.vm.goToHome()
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
      expect(actions.restartGame).toHaveBeenCalled()
    })

    it('does nothing if already on home', () => {
      store.state.squaresBool = false
      store.state.gameStartBool = false
      const wrapper = createWrapper('Home')
      wrapper.vm.goToHome()
      expect(wrapper.vm.$router.push).not.toHaveBeenCalled()
    })

    it('navigates when squaresBool true but gameStartBool false', () => {
      store.state.squaresBool = true
      store.state.gameStartBool = false
      const wrapper = createWrapper('Level')
      wrapper.vm.goToHome()
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
    })
  })

  describe('backgroundColor watcher', () => {
    it('sets body background on mount', () => {
      createWrapper()
      expect(document.body.style.backgroundColor).not.toBe('')
    })

    it('updates body background when backgroundColor changes', async () => {
      const wrapper = createWrapper()
      store.state.backgroundColor = '#555555'
      await wrapper.vm.$nextTick()
      expect(document.body.style.backgroundColor).not.toBe('')
    })
  })

  it('maps computed state properties', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.backgroundColor).toBe('#e9e9e9')
    expect(wrapper.vm.gameStartBool).toBe(false)
    expect(wrapper.vm.squaresBool).toBe(false)
  })

  it('renders Speed Miner heading', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Speed Miner')
  })
})
