import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Level from '@/views/Level.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Level', () => {
  let actions, store

  beforeEach(() => {
    actions = {
      instantiateRectangleLevel: jest.fn(),
      makeCells: jest.fn(),
      restartGame: jest.fn(),
      checkCell: jest.fn(),
      placeFlag: jest.fn(),
      checkMiddleClick: jest.fn()
    }
    store = new Vuex.Store({
      state: { cells: [0, 1, 2, 3] },
      actions
    })
  })

  function createWrapper(level = '1') {
    return shallowMount(Level, {
      localVue,
      store,
      mocks: {
        $route: { params: { level } }
      },
      stubs: {
        GamePanel: true
      }
    })
  }

  it('computes level from route params', () => {
    const wrapper = createWrapper('2')
    expect(wrapper.vm.level).toBe(2)
  })

  it('computes config for level 1', () => {
    const wrapper = createWrapper('1')
    expect(wrapper.vm.config).toEqual(
      expect.objectContaining({ height: 10, width: 10, num_cells: 100, num_mines: 12 })
    )
  })

  it('computes config for level 2', () => {
    const wrapper = createWrapper('2')
    expect(wrapper.vm.config).toEqual(
      expect.objectContaining({ height: 10, width: 25, num_cells: 250, num_mines: 35 })
    )
  })

  it('computes config for level 3', () => {
    const wrapper = createWrapper('3')
    expect(wrapper.vm.config).toEqual(
      expect.objectContaining({ height: 16, width: 30, num_cells: 480, num_mines: 99 })
    )
  })

  it('computes gridStyle with correct dimensions', () => {
    const wrapper = createWrapper('1')
    expect(wrapper.vm.gridStyle).toEqual(
      expect.objectContaining({
        width: '420px',
        height: '420px',
        flexWrap: 'wrap',
        display: 'flex'
      })
    )
  })

  it('dispatches instantiateRectangleLevel on mount', () => {
    createWrapper('1')
    expect(actions.instantiateRectangleLevel).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ height: 10, width: 10, num_cells: 100, num_mines: 12, level: 1 })
    )
  })

  it('dispatches makeCells on mount', async () => {
    const wrapper = createWrapper('1')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(actions.makeCells).toHaveBeenCalledWith(
      expect.anything(),
      { num_cells: 100 }
    )
  })

  it('dispatches restartGame on beforeDestroy', () => {
    const wrapper = createWrapper('1')
    wrapper.destroy()
    expect(actions.restartGame).toHaveBeenCalled()
  })

  it('renders grid cells', () => {
    const wrapper = createWrapper('1')
    const cells = wrapper.findAll('.grid-cell')
    expect(cells.length).toBe(4) // matches cells: [0,1,2,3]
  })
})
