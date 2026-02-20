import { createTestStore } from '../helpers/storeFactory'
import { createMockSquares } from '../helpers/mockDomElements'

describe('Store Mutations', () => {
  let store
  let squares

  beforeEach(() => {
    squares = createMockSquares(4)
    store = createTestStore({ squares, numCells: 4, squaresBool: true })
  })

  describe('ADD_ERROR', () => {
    it('adds error message to errors array', () => {
      store.commit('ADD_ERROR', { message: 'test error' })
      expect(store.state.errors).toEqual(['test error'])
    })

    it('handles error without message', () => {
      store.commit('ADD_ERROR', {})
      expect(store.state.errors).toEqual(['An unknown error occurred'])
    })

    it('handles null error', () => {
      store.commit('ADD_ERROR', null)
      expect(store.state.errors).toEqual(['An unknown error occurred'])
    })
  })

  describe('CELL_MINE', () => {
    it('adds mine class to valid cell', () => {
      store.commit('CELL_MINE', 0)
      expect(squares[0].classList.contains('mine')).toBe(true)
    })

    it('does nothing for invalid index', () => {
      store.commit('CELL_MINE', -1)
      store.commit('CELL_MINE', 99)
    })
  })

  describe('CELL_MINE_DEATH', () => {
    it('adds mine-death class to cell', () => {
      store.commit('CELL_MINE_DEATH', 1)
      expect(squares[1].classList.contains('mine-death')).toBe(true)
    })

    it('does nothing for invalid index', () => {
      store.commit('CELL_MINE_DEATH', -1)
    })
  })

  describe('CELL_NUMBER', () => {
    it('sets innerText and style for number 1 (blue)', () => {
      store.commit('CELL_NUMBER', { cell_index: 0, number: 1 })
      expect(squares[0].innerText).toBe(1)
      expect(squares[0].style.color).toBe('blue')
      expect(squares[0].style.lineHeight).toBe('40px')
      expect(squares[0].style.fontSize).toBe('x-large')
    })

    it('sets green for number 2', () => {
      store.commit('CELL_NUMBER', { cell_index: 0, number: 2 })
      expect(squares[0].style.color).toBe('green')
    })

    it('sets red for number 3', () => {
      store.commit('CELL_NUMBER', { cell_index: 0, number: 3 })
      expect(squares[0].style.color).toBe('red')
    })

    it('sets purple for number 4', () => {
      store.commit('CELL_NUMBER', { cell_index: 0, number: 4 })
      expect(squares[0].style.color).toBe('purple')
    })

    it('sets maroon for number 5', () => {
      store.commit('CELL_NUMBER', { cell_index: 0, number: 5 })
      expect(squares[0].style.color).toBe('maroon')
    })

    it('sets orange for number 6', () => {
      store.commit('CELL_NUMBER', { cell_index: 0, number: 6 })
      expect(squares[0].style.color).toBe('orange')
    })

    it('sets brown for number 7', () => {
      store.commit('CELL_NUMBER', { cell_index: 0, number: 7 })
      expect(squares[0].style.color).toBe('brown')
    })

    it('sets black for number 8', () => {
      store.commit('CELL_NUMBER', { cell_index: 0, number: 8 })
      expect(squares[0].style.color).toBe('rgb(0, 0, 0)')
    })

    it('does nothing for invalid index', () => {
      store.commit('CELL_NUMBER', { cell_index: -1, number: 1 })
    })
  })

  describe('CELL_UNCOVER', () => {
    it('adds uncovered class', () => {
      store.commit('CELL_UNCOVER', 2)
      expect(squares[2].classList.contains('uncovered')).toBe(true)
    })

    it('does nothing for invalid index', () => {
      store.commit('CELL_UNCOVER', -1)
    })
  })

  describe('Modal mutations', () => {
    it('OPEN_GAME_LOSS_MODAL sets gameLossModalBool to true', () => {
      store.commit('OPEN_GAME_LOSS_MODAL')
      expect(store.state.gameLossModalBool).toBe(true)
    })

    it('CLOSE_GAME_LOSS_MODAL sets gameLossModalBool to false', () => {
      store.commit('OPEN_GAME_LOSS_MODAL')
      store.commit('CLOSE_GAME_LOSS_MODAL')
      expect(store.state.gameLossModalBool).toBe(false)
    })

    it('OPEN_GAME_WIN_MODAL sets gameWinModalBool to true', () => {
      store.commit('OPEN_GAME_WIN_MODAL')
      expect(store.state.gameWinModalBool).toBe(true)
    })

    it('CLOSE_GAME_WIN_MODAL sets gameWinModalBool to false', () => {
      store.commit('OPEN_GAME_WIN_MODAL')
      store.commit('CLOSE_GAME_WIN_MODAL')
      expect(store.state.gameWinModalBool).toBe(false)
    })
  })

  describe('Mine counter mutations', () => {
    it('DECREMENT_MINE_COUNTER decrements', () => {
      store = createTestStore({ numMinesLeft: 10 })
      store.commit('DECREMENT_MINE_COUNTER')
      expect(store.state.numMinesLeft).toBe(9)
    })

    it('INCREMENT_MINE_COUNTER increments', () => {
      store = createTestStore({ numMinesLeft: 10 })
      store.commit('INCREMENT_MINE_COUNTER')
      expect(store.state.numMinesLeft).toBe(11)
    })

    it('RESET_MINE_COUNTER resets to numMines', () => {
      store = createTestStore({ numMines: 12, numMinesLeft: 5 })
      store.commit('RESET_MINE_COUNTER')
      expect(store.state.numMinesLeft).toBe(12)
    })

    it('ZERO_MINE_COUNTER sets to 0', () => {
      store = createTestStore({ numMinesLeft: 10 })
      store.commit('ZERO_MINE_COUNTER')
      expect(store.state.numMinesLeft).toBe(0)
    })
  })

  describe('DISABLE_GRID / ENABLE_GRID', () => {
    it('DISABLE_GRID sets disableGridBool', () => {
      store.commit('DISABLE_GRID')
      expect(store.state.disableGridBool).toBe(true)
    })

    it('ENABLE_GRID resets grid state', () => {
      store.commit('DISABLE_GRID')
      store.commit('ENABLE_GRID')
      expect(store.state.disableGridBool).toBe(false)
      expect(store.state.squaresBool).toBe(false)
      expect(store.state.gameStartBool).toBe(false)
    })
  })

  describe('Timer mutations', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })
    afterEach(() => {
      jest.useRealTimers()
    })

    it('START_TIMER creates interval', () => {
      store.commit('SET_START_TIME')
      store.commit('START_TIMER')
      expect(store.state.timer).not.toBeNull()
    })

    it('END_TIMER clears interval', () => {
      store.commit('SET_START_TIME')
      store.commit('START_TIMER')
      store.commit('END_TIMER')
      // timer ref still set, but interval is cleared
      jest.advanceTimersByTime(2000)
      expect(store.state.timeElapsed).toBe(0)
    })

    it('START_TIMER clears previous timer before starting new one', () => {
      store.commit('SET_START_TIME')
      store.commit('START_TIMER')
      const firstTimer = store.state.timer
      store.commit('START_TIMER')
      expect(store.state.timer).not.toBe(firstTimer)
    })

    it('SET_START_TIME sets startTime', () => {
      store.commit('SET_START_TIME')
      expect(store.state.startTime).toBeGreaterThan(0)
    })

    it('RESET_TIME_ELAPSED sets timeElapsed to 0', () => {
      store.state.timeElapsed = 50
      store.commit('RESET_TIME_ELAPSED')
      expect(store.state.timeElapsed).toBe(0)
    })

    it('SET_TIME_ELAPSED_MAX sets timeElapsed to 999', () => {
      store.commit('SET_TIME_ELAPSED_MAX')
      expect(store.state.timeElapsed).toBe(999)
    })
  })

  describe('FLAG_ADD / FLAG_REMOVE', () => {
    it('FLAG_ADD adds flag class', () => {
      store.commit('FLAG_ADD', 0)
      expect(squares[0].classList.contains('flag')).toBe(true)
    })

    it('FLAG_REMOVE removes flag class', () => {
      store.commit('FLAG_ADD', 0)
      store.commit('FLAG_REMOVE', 0)
      expect(squares[0].classList.contains('flag')).toBe(false)
    })

    it('FLAG_ADD does nothing for invalid index', () => {
      store.commit('FLAG_ADD', -1)
    })

    it('FLAG_REMOVE does nothing for invalid index', () => {
      store.commit('FLAG_REMOVE', -1)
    })
  })

  describe('GET_SQUARES', () => {
    it('sets squares and squaresBool', () => {
      const newSquares = createMockSquares(9)
      store = createTestStore()
      store.commit('GET_SQUARES', newSquares)
      expect(store.state.squares).toBe(newSquares)
      expect(store.state.squaresBool).toBe(true)
    })
  })

  describe('INSTANTIATE_RECTANGLE_LEVEL', () => {
    it('sets level dimensions', () => {
      store.commit('INSTANTIATE_RECTANGLE_LEVEL', {
        height: 10, level: 1, num_cells: 100, num_mines: 12, width: 10
      })
      expect(store.state.height).toBe(10)
      expect(store.state.level).toBe(1)
      expect(store.state.numCells).toBe(100)
      expect(store.state.numMines).toBe(12)
      expect(store.state.numMinesLeft).toBe(12)
      expect(store.state.width).toBe(10)
    })
  })

  describe('MAKE_CELLS', () => {
    it('sets cells array', () => {
      store.commit('MAKE_CELLS', [0, 1, 2])
      expect(store.state.cells).toEqual([0, 1, 2])
    })
  })

  describe('PLACE_MINE / RESET_MINES', () => {
    it('PLACE_MINE adds to mineIndices set', () => {
      store.commit('PLACE_MINE', 5)
      expect(store.state.mineIndices.has(5)).toBe(true)
    })

    it('RESET_MINES clears mineIndices', () => {
      store.commit('PLACE_MINE', 5)
      store.commit('RESET_MINES')
      expect(store.state.mineIndices.size).toBe(0)
    })
  })

  describe('Statistics mutations', () => {
    it('SET_BEGINNER_STATISTICS', () => {
      store.commit('SET_BEGINNER_STATISTICS', { num_games: 10, num_wins: 5 })
      expect(store.state.beginnerGamesPlayed).toBe(10)
      expect(store.state.beginnerGamesWon).toBe(5)
    })

    it('SET_INTERMEDIATE_STATISTICS', () => {
      store.commit('SET_INTERMEDIATE_STATISTICS', { num_games: 20, num_wins: 8 })
      expect(store.state.intermediateGamesPlayed).toBe(20)
      expect(store.state.intermediateGamesWon).toBe(8)
    })

    it('SET_ADVANCED_STATISTICS', () => {
      store.commit('SET_ADVANCED_STATISTICS', { num_games: 30, num_wins: 3 })
      expect(store.state.advancedGamesPlayed).toBe(30)
      expect(store.state.advancedGamesWon).toBe(3)
    })
  })

  describe('SET_SCORES', () => {
    it('sets times data', () => {
      const data = [{ name: 'Alice', time: 10 }]
      store.commit('SET_SCORES', data)
      expect(store.state.times).toEqual(data)
    })
  })

  describe('Game start mutations', () => {
    it('SWITCH_GAME_START_BOOL_ON', () => {
      store.commit('SWITCH_GAME_START_BOOL_ON')
      expect(store.state.gameStartBool).toBe(true)
    })

    it('SWITCH_GAME_START_BOOL_OFF', () => {
      store.commit('SWITCH_GAME_START_BOOL_ON')
      store.commit('SWITCH_GAME_START_BOOL_OFF')
      expect(store.state.gameStartBool).toBe(false)
    })
  })

  describe('TOGGLE_NIGHT_MODE', () => {
    it('enables night mode with dark background', () => {
      store.commit('TOGGLE_NIGHT_MODE', true)
      expect(store.state.nightModeBool).toBe(true)
      expect(store.state.backgroundColor).toBe('#555555')
    })

    it('disables night mode with light background', () => {
      store.commit('TOGGLE_NIGHT_MODE', false)
      expect(store.state.nightModeBool).toBe(false)
      expect(store.state.backgroundColor).toBe('#e9e9e9')
    })
  })

  describe('TOGGLE_ZOOM', () => {
    it('sets body zoom for valid level', () => {
      store.commit('TOGGLE_ZOOM', 1)
      expect(document.body.style.zoom).toBe('50%')
    })

    it('sets 100% zoom for level 3', () => {
      store.commit('TOGGLE_ZOOM', 3)
      expect(document.body.style.zoom).toBe('100%')
    })

    it('sets 200% zoom for level 5', () => {
      store.commit('TOGGLE_ZOOM', 5)
      expect(document.body.style.zoom).toBe('200%')
    })

    it('does nothing for invalid zoom level', () => {
      document.body.style.zoom = '100%'
      store.commit('TOGGLE_ZOOM', 99)
      expect(document.body.style.zoom).toBe('100%')
    })
  })
})
