import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Home from '@/views/Home.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Home', () => {
  let actions, store

  beforeEach(() => {
    actions = {
      restartGame: jest.fn(),
      getUserStatistics: jest.fn().mockResolvedValue(),
      getScoresMongo: jest.fn().mockResolvedValue(),
      toggleNightMode: jest.fn(),
      toggleZoom: jest.fn()
    }
    store = new Vuex.Store({
      state: {
        advancedGamesPlayed: 10,
        advancedGamesWon: 2,
        backgroundColor: '#e9e9e9',
        beginnerGamesPlayed: 20,
        beginnerGamesWon: 15,
        intermediateGamesPlayed: 30,
        intermediateGamesWon: 10,
        nightModeBool: false,
        times: []
      },
      actions
    })
  })

  function createWrapper() {
    return shallowMount(Home, {
      localVue,
      store,
      stubs: {
        LevelMenu: true,
        'b-card': { template: '<div><slot/></div>' },
        'b-tabs': { template: '<div><slot/></div>' },
        'b-tab': { template: '<div><slot/></div>' },
        'b-checkbox': { template: '<input type="checkbox" />' },
        'b-form-group': { template: '<div><slot/></div>' },
        'b-form-radio': { template: '<input type="radio" />' },
        'b-button': { template: '<button><slot/></button>' },
        'b-table': true,
        'b-popover': true
      }
    })
  }

  it('dispatches restartGame on created', () => {
    createWrapper()
    expect(actions.restartGame).toHaveBeenCalled()
  })

  it('dispatches getUserStatistics on created', () => {
    createWrapper()
    expect(actions.getUserStatistics).toHaveBeenCalled()
  })

  it('dispatches getScoresMongo on created', () => {
    createWrapper()
    expect(actions.getScoresMongo).toHaveBeenCalled()
  })

  describe('calculateUserStatisticAverages', () => {
    it('calculates beginner average', () => {
      const wrapper = createWrapper()
      wrapper.vm.calculateUserStatisticAverages()
      expect(wrapper.vm.beginnerAverage).toBe((15 / 20 * 100).toFixed(3))
    })

    it('returns 0 when no games played', () => {
      store.state.beginnerGamesPlayed = 0
      store.state.beginnerGamesWon = 0
      const wrapper = createWrapper()
      wrapper.vm.calculateUserStatisticAverages()
      expect(wrapper.vm.beginnerAverage).toBe(0)
    })

    it('calculates intermediate average', () => {
      const wrapper = createWrapper()
      wrapper.vm.calculateUserStatisticAverages()
      expect(wrapper.vm.intermediateAverage).toBe((10 / 30 * 100).toFixed(3))
    })

    it('calculates advanced average', () => {
      const wrapper = createWrapper()
      wrapper.vm.calculateUserStatisticAverages()
      expect(wrapper.vm.advancedAverage).toBe((2 / 10 * 100).toFixed(3))
    })

    it('returns 0 for intermediate when no games', () => {
      store.state.intermediateGamesPlayed = 0
      const wrapper = createWrapper()
      wrapper.vm.calculateUserStatisticAverages()
      expect(wrapper.vm.intermediateAverage).toBe(0)
    })

    it('returns 0 for advanced when no games', () => {
      store.state.advancedGamesPlayed = 0
      const wrapper = createWrapper()
      wrapper.vm.calculateUserStatisticAverages()
      expect(wrapper.vm.advancedAverage).toBe(0)
    })
  })

  describe('sortTimes', () => {
    it('sorts and ranks beginner times', () => {
      store.state.times = [
        { name: 'B', time: 20, level: 1 },
        { name: 'A', time: 10, level: 1 }
      ]
      const wrapper = createWrapper()
      wrapper.vm.sortTimes()
      expect(wrapper.vm.beginnerTimes[0].name).toBe('A')
      expect(wrapper.vm.beginnerTimes[0].rank).toBe(1)
      expect(wrapper.vm.beginnerTimes[1].rank).toBe(2)
    })

    it('sorts intermediate and advanced times', () => {
      store.state.times = [
        { name: 'C', time: 30, level: 2 },
        { name: 'D', time: 5, level: 3 }
      ]
      const wrapper = createWrapper()
      wrapper.vm.sortTimes()
      expect(wrapper.vm.intermediateTimes.length).toBe(1)
      expect(wrapper.vm.advancedTimes.length).toBe(1)
    })

    it('ignores unknown levels', () => {
      store.state.times = [
        { name: 'X', time: 10, level: 99 }
      ]
      const wrapper = createWrapper()
      wrapper.vm.sortTimes()
      expect(wrapper.vm.beginnerTimes.length).toBe(0)
      expect(wrapper.vm.intermediateTimes.length).toBe(0)
      expect(wrapper.vm.advancedTimes.length).toBe(0)
    })
  })

  describe('compareTimes', () => {
    it('sorts ascending by time', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.compareTimes({ time: 10 }, { time: 20 })).toBeLessThan(0)
      expect(wrapper.vm.compareTimes({ time: 20 }, { time: 10 })).toBeGreaterThan(0)
      expect(wrapper.vm.compareTimes({ time: 10 }, { time: 10 })).toBe(0)
    })
  })

  it('sets nightMode to false when backgroundColor is light', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.nightMode).toBe(false)
  })

  it('sets nightMode to true when backgroundColor is dark', () => {
    store.state.backgroundColor = '#555555'
    const wrapper = createWrapper()
    expect(wrapper.vm.nightMode).toBe(true)
  })

  it('dispatches toggleNightMode when nightMode changes', async () => {
    const wrapper = createWrapper()
    wrapper.setData({ nightMode: true })
    await wrapper.vm.$nextTick()
    expect(actions.toggleNightMode).toHaveBeenCalledWith(
      expect.anything(),
      { night_mode_bool: true }
    )
  })

  it('dispatches toggleZoom when zoomLevel changes', async () => {
    const wrapper = createWrapper()
    wrapper.setData({ zoomLevel: 5 })
    await wrapper.vm.$nextTick()
    expect(actions.toggleZoom).toHaveBeenCalledWith(
      expect.anything(),
      { zoom_level: 5 }
    )
  })

  it('has correct initial data', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.perPage).toBe(10)
    expect(wrapper.vm.fields).toEqual(['rank', 'name', 'time'])
    expect(wrapper.vm.currentPageBeginner).toBe(1)
    expect(wrapper.vm.currentPageIntermediate).toBe(1)
    expect(wrapper.vm.currentPageAdvanced).toBe(1)
    expect(wrapper.vm.zoomLevel).toBe(3)
  })
})
