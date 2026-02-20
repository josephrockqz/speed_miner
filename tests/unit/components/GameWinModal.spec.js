import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import GameWinModal from '@/components/GameWinModal.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

function createWrapper(storeState = {}) {
  const actions = {
    postScoreMongo: jest.fn().mockResolvedValue({}),
    closeGameWinModal: jest.fn()
  }
  const store = new Vuex.Store({
    state: {
      gameWinModalBool: true,
      level: 1,
      timeElapsed: 42,
      ...storeState
    },
    actions
  })

  const wrapper = shallowMount(GameWinModal, {
    localVue,
    store,
    stubs: { 'b-modal': { template: '<div><slot/></div>', props: ['id', 'title'] } }
  })

  return { wrapper, store, actions }
}

describe('GameWinModal', () => {
  describe('checkNameFill', () => {
    it('returns true for empty name', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: '' })
      expect(wrapper.vm.checkNameFill()).toBe(true)
    })

    it('returns true for whitespace-only name', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: '   ' })
      expect(wrapper.vm.checkNameFill()).toBe(true)
    })

    it('returns true for name longer than 24 chars', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: 'a'.repeat(25) })
      expect(wrapper.vm.checkNameFill()).toBe(true)
    })

    it('returns false for valid name', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: 'Alice' })
      expect(wrapper.vm.checkNameFill()).toBe(false)
    })

    it('returns false for name with spaces', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: 'John Doe' })
      expect(wrapper.vm.checkNameFill()).toBe(false)
    })

    it('returns false for name with hyphens and underscores', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: 'player-1_test' })
      expect(wrapper.vm.checkNameFill()).toBe(false)
    })

    it('returns true for special characters', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: 'test@user' })
      expect(wrapper.vm.checkNameFill()).toBe(true)
    })

    it('returns true for profanity', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: 'damn' })
      expect(wrapper.vm.checkNameFill()).toBe(true)
    })

    it('returns true for case-insensitive profanity', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: 'HELL' })
      expect(wrapper.vm.checkNameFill()).toBe(true)
    })

    it('returns true for profanity embedded in name', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: 'test-hell-o' })
      expect(wrapper.vm.checkNameFill()).toBe(true)
    })

    it('accepts exactly 24 characters', () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: 'a'.repeat(24) })
      expect(wrapper.vm.checkNameFill()).toBe(false)
    })
  })

  describe('submitScore', () => {
    it('dispatches postScoreMongo and closes modal', async () => {
      const { wrapper, actions } = createWrapper()
      wrapper.setData({ name: 'Alice' })

      await wrapper.vm.submitScore()

      expect(actions.postScoreMongo).toHaveBeenCalledWith(
        expect.anything(),
        { level: 1, name: 'Alice', time: 42 }
      )
      expect(actions.closeGameWinModal).toHaveBeenCalled()
      expect(wrapper.vm.name).toBe('')
    })

    it('sets submitting flag during submission', async () => {
      const { wrapper } = createWrapper()
      wrapper.setData({ name: 'Bob' })

      const promise = wrapper.vm.submitScore()
      expect(wrapper.vm.submitting).toBe(true)
      await promise
      expect(wrapper.vm.submitting).toBe(false)
    })

    it('trims name before submitting', async () => {
      const { wrapper, actions } = createWrapper()
      wrapper.setData({ name: '  Alice  ' })

      await wrapper.vm.submitScore()

      expect(actions.postScoreMongo).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'Alice' })
      )
    })
  })

  it('has profanityList data', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.vm.profanityList).toBeInstanceOf(Array)
    expect(wrapper.vm.profanityList.length).toBeGreaterThan(0)
  })

  it('initializes with empty name and submitting false', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.vm.name).toBe('')
    expect(wrapper.vm.submitting).toBe(false)
  })
})
