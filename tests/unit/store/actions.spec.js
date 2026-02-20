import { createTestStore } from '../helpers/storeFactory'
import { createMockSquares } from '../helpers/mockDomElements'
import EventServiceMongo from '@/services/EventServiceMongo'
import flushPromises from 'flush-promises'

jest.mock('@/services/EventServiceMongo')

describe('Store Actions', () => {
  let store
  let squares

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    squares = createMockSquares(100)
    store = createTestStore({
      squares,
      numCells: 100,
      numMines: 12,
      width: 10,
      height: 10,
      squaresBool: true,
      level: 1
    })
    localStorage.clear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('checkCell', () => {
    beforeEach(() => {
      // Pre-place mines so game is started
      store.commit('SWITCH_GAME_START_BOOL_ON')
    })

    it('does nothing when grid is disabled', async () => {
      store.commit('DISABLE_GRID')
      await store.dispatch('checkCell', { cell_index: 50, level: 1 })
      expect(squares[50].classList.contains('uncovered')).toBe(false)
    })

    it('uncovers a non-mine cell', async () => {
      // Surround cell 55 with mines so recursion is bounded
      [44, 45, 46, 54, 56, 64, 65, 66].forEach(i => store.commit('PLACE_MINE', i))
      await store.dispatch('checkCell', { cell_index: 55, level: 1 })
      await flushPromises()
      expect(squares[55].classList.contains('uncovered')).toBe(true)
    })

    it('triggers game loss when mine is clicked', async () => {
      store.commit('PLACE_MINE', 50)
      await store.dispatch('checkCell', { cell_index: 50, level: 1 })
      expect(squares[50].classList.contains('mine-death')).toBe(true)
      expect(store.state.gameLossModalBool).toBe(true)
    })

    it('does not trigger loss if mine cell has a flag', async () => {
      store.commit('PLACE_MINE', 50)
      squares[50].classList.add('flag')
      await store.dispatch('checkCell', { cell_index: 50, level: 1 })
      expect(store.state.gameLossModalBool).toBe(false)
    })

    it('places mines on first click and starts game', async () => {
      // Use small grid to avoid OOM from recursion
      const smallSquares = createMockSquares(16)
      store = createTestStore({
        squares: smallSquares,
        numCells: 16,
        numMines: 7,
        width: 4,
        height: 4,
        squaresBool: true,
        gameStartBool: false,
        level: 1
      })
      await store.dispatch('checkCell', { cell_index: 0, level: 1 })
      await flushPromises()
      expect(store.state.gameStartBool).toBe(true)
      expect(store.state.mineIndices.size).toBe(7)
    })
  })

  describe('checkGameWon', () => {
    it('triggers gameWin when all non-mine cells are uncovered', async () => {
      // 4-cell grid: 1 mine at index 3, uncover the rest
      squares = createMockSquares(4)
      store = createTestStore({
        squares,
        numCells: 4,
        numMines: 1,
        width: 2,
        height: 2,
        squaresBool: true,
        gameStartBool: true,
        level: 1
      })
      store.commit('PLACE_MINE', 3)
      squares[0].classList.add('uncovered')
      squares[1].classList.add('uncovered')
      squares[2].classList.add('uncovered')

      await store.dispatch('checkGameWon', { level: 1 })
      expect(store.state.gameWinModalBool).toBe(true)
    })

    it('does not trigger gameWin if cells remain', async () => {
      squares = createMockSquares(4)
      store = createTestStore({
        squares,
        numCells: 4,
        numMines: 1,
        width: 2,
        height: 2,
        squaresBool: true,
        level: 1
      })
      store.commit('PLACE_MINE', 3)
      squares[0].classList.add('uncovered')
      // index 1 and 2 not uncovered

      await store.dispatch('checkGameWon', { level: 1 })
      expect(store.state.gameWinModalBool).toBe(false)
    })
  })

  describe('checkMiddleClick', () => {
    it('returns early if squaresBool is false', () => {
      store = createTestStore({ squaresBool: false })
      store.dispatch('checkMiddleClick', { cell_index: 50, level: 1 })
    })

    it('returns early if cell is not uncovered', () => {
      store.dispatch('checkMiddleClick', { cell_index: 50, level: 1 })
      // no error thrown
    })

    it('returns early if cell has 0 mines nearby', () => {
      squares[55].classList.add('uncovered')
      squares[55].innerText = 0
      store.dispatch('checkMiddleClick', { cell_index: 55, level: 1 })
    })

    it('uncovers neighbors when flag count matches', async () => {
      // Surround cell 55's neighbors with mines to bound recursion
      // Cell 55 neighbors: 44,45,46,54,56,64,65,66
      // Put mines at all neighbors except 54, flag them all
      [44, 45, 46, 56, 64, 65, 66].forEach(i => {
        store.commit('PLACE_MINE', i)
        squares[i].classList.add('flag')
      })
      squares[55].classList.add('uncovered')
      squares[55].innerText = '7'

      await store.dispatch('checkMiddleClick', { cell_index: 55, level: 1 })
      await flushPromises()

      // 54 is the only non-mine neighbor, should be uncovered
      expect(squares[54].classList.contains('uncovered')).toBe(true)
    })
  })

  describe('closeGameLossModal / closeGameWinModal', () => {
    it('closes game loss modal', () => {
      store.commit('OPEN_GAME_LOSS_MODAL')
      store.dispatch('closeGameLossModal')
      expect(store.state.gameLossModalBool).toBe(false)
    })

    it('closes game win modal', () => {
      store.commit('OPEN_GAME_WIN_MODAL')
      store.dispatch('closeGameWinModal')
      expect(store.state.gameWinModalBool).toBe(false)
    })
  })

  describe('gameLoss', () => {
    it('ends timer, disables grid, reveals mines, opens modal', async () => {
      store.commit('SET_START_TIME')
      store.commit('START_TIMER')
      store.commit('SWITCH_GAME_START_BOOL_ON')
      store.commit('PLACE_MINE', 5)

      await store.dispatch('gameLoss', { level: 1 })

      expect(store.state.disableGridBool).toBe(true)
      expect(store.state.gameStartBool).toBe(false)
      expect(store.state.gameLossModalBool).toBe(true)
      expect(squares[5].classList.contains('mine')).toBe(true)
    })
  })

  describe('gameWin', () => {
    it('ends timer, disables grid, zeros mines, opens modal', async () => {
      store.commit('SET_START_TIME')
      store.commit('START_TIMER')
      store.commit('SWITCH_GAME_START_BOOL_ON')
      store.commit('PLACE_MINE', 5)
      store = createTestStore({
        squares,
        numCells: 100,
        numMines: 1,
        numMinesLeft: 1,
        width: 10,
        height: 10,
        squaresBool: true,
        level: 1
      })
      store.commit('PLACE_MINE', 5)

      await store.dispatch('gameWin', { level: 1 })

      expect(store.state.disableGridBool).toBe(true)
      expect(store.state.gameStartBool).toBe(false)
      expect(store.state.numMinesLeft).toBe(0)
      expect(store.state.gameWinModalBool).toBe(true)
      expect(squares[5].classList.contains('mine')).toBe(true)
    })
  })

  describe('getNeighborMinesRectangle', () => {
    it('returns 0 when no neighboring mines', async () => {
      store.commit('PLACE_MINE', 0)
      store.commit('PLACE_MINE', 99)
      const count = await store.dispatch('getNeighborMinesRectangle', { cell_index: 55 })
      expect(count).toBe(0)
    })

    it('returns correct count for adjacent mines', async () => {
      store.commit('PLACE_MINE', 54)
      store.commit('PLACE_MINE', 56)
      const count = await store.dispatch('getNeighborMinesRectangle', { cell_index: 55 })
      expect(count).toBe(2)
    })
  })

  describe('getNumberOfNeighborFlags', () => {
    it('counts neighboring flags', async () => {
      squares[54].classList.add('flag')
      squares[56].classList.add('flag')
      const count = await store.dispatch('getNumberOfNeighborFlags', { cell_index: 55 })
      expect(count).toBe(2)
    })

    it('returns 0 when no flags', async () => {
      const count = await store.dispatch('getNumberOfNeighborFlags', { cell_index: 55 })
      expect(count).toBe(0)
    })
  })

  describe('getScoresMongo', () => {
    it('fetches scores and commits SET_SCORES', async () => {
      const scores = [{ name: 'Alice', time: 10, level: 1 }]
      EventServiceMongo.getScores.mockResolvedValue(scores)

      await store.dispatch('getScoresMongo')
      expect(store.state.times).toEqual(scores)
    })

    it('commits ADD_ERROR on failure', async () => {
      EventServiceMongo.getScores.mockRejectedValue({ message: 'Network error' })

      await store.dispatch('getScoresMongo')
      expect(store.state.errors).toContain('Network error')
    })
  })

  describe('getSquares', () => {
    it('queries DOM and sets squares', () => {
      const div = document.createElement('div')
      div.className = 'level1'
      const child = document.createElement('div')
      div.appendChild(child)
      document.body.appendChild(div)

      store = createTestStore({ level: 1 })
      store.dispatch('getSquares')
      expect(store.state.squaresBool).toBe(true)
      expect(store.state.squares.length).toBe(1)

      document.body.removeChild(div)
    })
  })

  describe('getUserStatistics', () => {
    it('reads from localStorage and commits stats', () => {
      localStorage.setItem('numBeginnerGames', '10')
      localStorage.setItem('numBeginnerWins', '5')
      localStorage.setItem('numIntermediateGames', '20')
      localStorage.setItem('numIntermediateWins', '8')
      localStorage.setItem('numAdvancedGames', '30')
      localStorage.setItem('numAdvancedWins', '3')

      store.dispatch('getUserStatistics')

      expect(store.state.beginnerGamesPlayed).toBe(10)
      expect(store.state.beginnerGamesWon).toBe(5)
      expect(store.state.intermediateGamesPlayed).toBe(20)
      expect(store.state.intermediateGamesWon).toBe(8)
      expect(store.state.advancedGamesPlayed).toBe(30)
      expect(store.state.advancedGamesWon).toBe(3)
    })

    it('handles missing localStorage values', () => {
      store.dispatch('getUserStatistics')
      expect(store.state.beginnerGamesPlayed).toBe(0)
      expect(store.state.beginnerGamesWon).toBe(0)
    })

    it('clamps negative values to 0', () => {
      localStorage.setItem('numBeginnerGames', '-5')
      localStorage.setItem('numBeginnerWins', '-3')

      store.dispatch('getUserStatistics')
      expect(store.state.beginnerGamesPlayed).toBe(0)
      expect(store.state.beginnerGamesWon).toBe(0)
    })

    it('clamps wins to not exceed games', () => {
      localStorage.setItem('numBeginnerGames', '5')
      localStorage.setItem('numBeginnerWins', '50')

      store.dispatch('getUserStatistics')
      expect(store.state.beginnerGamesWon).toBeLessThanOrEqual(store.state.beginnerGamesPlayed)
    })
  })

  describe('instantiateRectangleLevel', () => {
    it('sets level dimensions via commit', async () => {
      await store.dispatch('instantiateRectangleLevel', {
        height: 16, level: 3, num_cells: 480, num_mines: 99, width: 30
      })
      expect(store.state.height).toBe(16)
      expect(store.state.width).toBe(30)
      expect(store.state.numCells).toBe(480)
      expect(store.state.numMines).toBe(99)
      expect(store.state.level).toBe(3)
    })
  })

  describe('makeCells', () => {
    it('creates cells array', async () => {
      await store.dispatch('makeCells', { num_cells: 5 })
      expect(store.state.cells).toEqual([0, 1, 2, 3, 4])
    })
  })

  describe('placeFlag', () => {
    it('places flag on empty cell', () => {
      store = createTestStore({
        squares,
        numCells: 100,
        numMinesLeft: 12,
        squaresBool: true,
        disableGridBool: false
      })
      store.dispatch('placeFlag', { cell_index: 50 })
      expect(squares[50].classList.contains('flag')).toBe(true)
      expect(store.state.numMinesLeft).toBe(11)
    })

    it('removes flag if already flagged', () => {
      store = createTestStore({
        squares,
        numCells: 100,
        numMinesLeft: 11,
        squaresBool: true,
        disableGridBool: false
      })
      squares[50].classList.add('flag')
      store.dispatch('placeFlag', { cell_index: 50 })
      expect(squares[50].classList.contains('flag')).toBe(false)
      expect(store.state.numMinesLeft).toBe(12)
    })

    it('does nothing when grid is disabled', () => {
      store = createTestStore({
        squares,
        numCells: 100,
        numMinesLeft: 12,
        squaresBool: true,
        disableGridBool: true
      })
      store.dispatch('placeFlag', { cell_index: 50 })
      expect(squares[50].classList.contains('flag')).toBe(false)
    })

    it('does nothing when squaresBool is false', () => {
      store = createTestStore({
        squares,
        numCells: 100,
        squaresBool: false,
        disableGridBool: false
      })
      store.dispatch('placeFlag', { cell_index: 50 })
      expect(squares[50].classList.contains('flag')).toBe(false)
    })

    it('does nothing on uncovered cell', () => {
      store = createTestStore({
        squares,
        numCells: 100,
        numMinesLeft: 12,
        squaresBool: true,
        disableGridBool: false
      })
      squares[50].classList.add('uncovered')
      store.dispatch('placeFlag', { cell_index: 50 })
      expect(squares[50].classList.contains('flag')).toBe(false)
    })

    it('does nothing on mine cell', () => {
      store = createTestStore({
        squares,
        numCells: 100,
        numMinesLeft: 12,
        squaresBool: true,
        disableGridBool: false
      })
      squares[50].classList.add('mine')
      store.dispatch('placeFlag', { cell_index: 50 })
      expect(squares[50].classList.contains('flag')).toBe(false)
    })
  })

  describe('placeMines', () => {
    it('places correct number of mines', async () => {
      store = createTestStore({
        squares,
        numCells: 100,
        numMines: 12,
        width: 10,
        height: 10,
        mineIndices: new Set()
      })
      await store.dispatch('placeMines', { start_index: 0 })
      expect(store.state.mineIndices.size).toBe(12)
    })

    it('does not place mines in exclusion zone (first click + neighbors)', async () => {
      store = createTestStore({
        squares,
        numCells: 100,
        numMines: 12,
        width: 10,
        height: 10,
        mineIndices: new Set()
      })
      await store.dispatch('placeMines', { start_index: 55 })
      expect(store.state.mineIndices.has(55)).toBe(false)
      // Neighbors of 55 in 10x10: 44,45,46,54,56,64,65,66
      expect(store.state.mineIndices.has(44)).toBe(false)
      expect(store.state.mineIndices.has(45)).toBe(false)
      expect(store.state.mineIndices.has(46)).toBe(false)
      expect(store.state.mineIndices.has(54)).toBe(false)
      expect(store.state.mineIndices.has(56)).toBe(false)
      expect(store.state.mineIndices.has(64)).toBe(false)
      expect(store.state.mineIndices.has(65)).toBe(false)
      expect(store.state.mineIndices.has(66)).toBe(false)
    })

    it('places mines deterministically with mocked random', async () => {
      let callCount = 0
      jest.spyOn(Math, 'random').mockImplementation(() => {
        // Return values that map to specific cells, avoiding exclusion zone of index 0
        return [0.50, 0.51, 0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58, 0.59, 0.60, 0.61][callCount++] || 0.99
      })

      store = createTestStore({
        squares,
        numCells: 100,
        numMines: 12,
        width: 10,
        height: 10,
        mineIndices: new Set()
      })
      await store.dispatch('placeMines', { start_index: 0 })
      expect(store.state.mineIndices.size).toBe(12)

      Math.random.mockRestore()
    })
  })

  describe('postScoreMongo', () => {
    it('posts score via EventServiceMongo', async () => {
      EventServiceMongo.insertScore.mockResolvedValue({})
      await store.dispatch('postScoreMongo', { level: 1, name: 'Alice', time: 10 })
      expect(EventServiceMongo.insertScore).toHaveBeenCalledWith(1, 'Alice', 10)
    })

    it('commits error on failure', async () => {
      EventServiceMongo.insertScore.mockRejectedValue({ message: 'Server error' })
      await store.dispatch('postScoreMongo', { level: 1, name: 'Bob', time: 20 })
      expect(store.state.errors).toContain('Server error')
    })
  })

  describe('recurseBlankCellsRectangle', () => {
    it('uncovers cell and dispatches uncoverCell on non-mine neighbors', async () => {
      // Surround cell 55 with mines so recursion is bounded
      [44, 45, 46, 54, 56, 64, 65, 66].forEach(i => store.commit('PLACE_MINE', i))
      await store.dispatch('recurseBlankCellsRectangle', { cell_index: 55 })
      await flushPromises()
      expect(squares[55].classList.contains('uncovered')).toBe(true)
    })
  })

  describe('restartGame', () => {
    it('resets grid state when squaresBool is true', async () => {
      squares[0].classList.add('uncovered')
      squares[0].innerText = '1'
      squares[0].style.color = 'blue'
      squares[1].classList.add('mine')
      squares[2].classList.add('flag')

      store.commit('PLACE_MINE', 5)
      store.commit('SET_START_TIME')
      store.commit('START_TIMER')

      await store.dispatch('restartGame')

      expect(store.state.disableGridBool).toBe(false)
      expect(store.state.squaresBool).toBe(false)
      expect(store.state.gameStartBool).toBe(false)
      expect(store.state.mineIndices.size).toBe(0)
      expect(store.state.timeElapsed).toBe(0)
      expect(squares[0].classList.contains('uncovered')).toBe(false)
      expect(squares[0].innerText).toBe('')
      expect(squares[0].style.color).toBe('')
      expect(squares[1].classList.contains('mine')).toBe(false)
      expect(squares[2].classList.contains('flag')).toBe(false)
    })

    it('does nothing when squaresBool is false', async () => {
      store = createTestStore({ squaresBool: false })
      await store.dispatch('restartGame')
      // No error
    })
  })

  describe('revealGridAfterLoss', () => {
    it('reveals unflagged mines', async () => {
      store.commit('PLACE_MINE', 5)
      store.commit('PLACE_MINE', 10)
      squares[10].classList.add('flag')

      await store.dispatch('revealGridAfterLoss')

      expect(squares[5].classList.contains('mine')).toBe(true)
      expect(squares[10].classList.contains('mine')).toBe(false) // flagged, not revealed
    })

    it('marks misplaced flags', async () => {
      squares[50].classList.add('flag')
      // 50 is not a mine
      await store.dispatch('revealGridAfterLoss')
      expect(squares[50].classList.contains('flag-misplaced')).toBe(true)
      expect(squares[50].classList.contains('flag')).toBe(false)
    })
  })

  describe('revealGridAfterWin', () => {
    it('reveals unflagged mines after win', async () => {
      store.commit('PLACE_MINE', 5)
      store.commit('PLACE_MINE', 10)
      squares[10].classList.add('flag')

      await store.dispatch('revealGridAfterWin')

      expect(squares[5].classList.contains('mine')).toBe(true)
      expect(squares[10].classList.contains('mine')).toBe(false) // already flagged
    })
  })

  describe('startGame', () => {
    it('sets start time and starts timer', async () => {
      await store.dispatch('startGame')
      expect(store.state.startTime).toBeGreaterThan(0)
      expect(store.state.timer).not.toBeNull()
    })
  })

  describe('timeExceeded', () => {
    it('sets max time and triggers game loss', async () => {
      await store.dispatch('timeExceeded', { level: 1 })
      expect(store.state.timeElapsed).toBe(999)
      expect(store.state.gameLossModalBool).toBe(true)
    })
  })

  describe('toggleNightMode', () => {
    it('enables night mode', async () => {
      await store.dispatch('toggleNightMode', { night_mode_bool: true })
      expect(store.state.nightModeBool).toBe(true)
      expect(store.state.backgroundColor).toBe('#555555')
    })

    it('disables night mode', async () => {
      await store.dispatch('toggleNightMode', { night_mode_bool: false })
      expect(store.state.nightModeBool).toBe(false)
      expect(store.state.backgroundColor).toBe('#e9e9e9')
    })
  })

  describe('toggleZoom', () => {
    it('sets zoom level', async () => {
      await store.dispatch('toggleZoom', { zoom_level: 4 })
      expect(document.body.style.zoom).toBe('150%')
    })
  })

  describe('uncoverCell', () => {
    it('uncovers a cell with neighboring mines', async () => {
      // Surround with mines to prevent recursion
      [44, 45, 46, 54, 56, 64, 65, 66].forEach(i => store.commit('PLACE_MINE', i))
      await store.dispatch('uncoverCell', { cell_index: 55 })
      await flushPromises()
      expect(squares[55].classList.contains('uncovered')).toBe(true)
      expect(squares[55].innerText).toBe(8)
    })

    it('skips already uncovered cells', async () => {
      squares[55].classList.add('uncovered')
      await store.dispatch('uncoverCell', { cell_index: 55 })
      // No error, just returns
    })

    it('skips flagged cells', async () => {
      squares[55].classList.add('flag')
      await store.dispatch('uncoverCell', { cell_index: 55 })
      expect(squares[55].classList.contains('uncovered')).toBe(false)
    })

    it('skips mine cells', async () => {
      squares[55].classList.add('mine')
      await store.dispatch('uncoverCell', { cell_index: 55 })
      expect(squares[55].classList.contains('uncovered')).toBe(false)
    })

    it('recurses on blank cells (0 neighbor mines)', async () => {
      // Use a small 3x3 grid with mines at edges to bound recursion
      const smallSquares = createMockSquares(9)
      store = createTestStore({
        squares: smallSquares,
        numCells: 9,
        numMines: 4,
        width: 3,
        height: 3,
        squaresBool: true,
        mineIndices: new Set()
      })
      // Place mines on corners to bound: 0, 2, 6, 8
      ;[0, 2, 6, 8].forEach(i => store.commit('PLACE_MINE', i))
      // Cell 4 (center) has 4 mine neighbors, so it won't recurse
      // Cell 1 (top middle) has 2 mine neighbors, so it won't recurse
      // Actually with mines at corners, center cell has 4 mine neighbors
      // Let's use just 2 mines so some cells can recurse
      store = createTestStore({
        squares: smallSquares,
        numCells: 9,
        numMines: 2,
        width: 3,
        height: 3,
        squaresBool: true,
        mineIndices: new Set()
      })
      // Place mines at 0 and 2 only - top-left and top-right
      store.commit('PLACE_MINE', 0)
      store.commit('PLACE_MINE', 2)
      // Cell 7 (bottom middle) has 0 mine neighbors, will recurse to 6,8,3,4,5
      // Cell 6 has mine neighbor at 3? No. Neighbors of 6: 3,4,7 — no mines
      // Cell 8 has neighbors: 4,5,7 — no mines
      // This creates a small bounded recursion
      await store.dispatch('uncoverCell', { cell_index: 7 })
      await flushPromises()
      expect(smallSquares[7].classList.contains('uncovered')).toBe(true)
      // Neighbors of 7 (bottom middle): 6, 8, 3, 4, 5 — all non-mine
      expect(smallSquares[6].classList.contains('uncovered')).toBe(true)
    })
  })

  describe('uncoverMiddleClick', () => {
    it('does nothing when grid is disabled', async () => {
      store.commit('DISABLE_GRID')
      await store.dispatch('uncoverMiddleClick', { cell_index: 55, level: 1 })
    })

    it('uncovers non-mine neighbors', async () => {
      // Surround cell 55 neighbors with mines so recursion is bounded
      [44, 45, 46, 56, 64, 65, 66].forEach(i => {
        store.commit('PLACE_MINE', i)
        squares[i].classList.add('flag')
      })
      // 54 is the only non-mine neighbor
      // Surround 54's other neighbors with mines too
      ;[43, 53, 63].forEach(i => store.commit('PLACE_MINE', i))

      await store.dispatch('uncoverMiddleClick', { cell_index: 55, level: 1 })
      await flushPromises()

      expect(squares[54].classList.contains('uncovered')).toBe(true)
    })

    it('triggers game loss when hitting unflagged mine', async () => {
      // Place mines around 55, don't flag 44
      [44, 45, 46, 54, 56, 64, 65, 66].forEach(i => store.commit('PLACE_MINE', i))

      await store.dispatch('uncoverMiddleClick', { cell_index: 55, level: 1 })
      await flushPromises()

      expect(squares[44].classList.contains('mine-death')).toBe(true)
      expect(store.state.gameLossModalBool).toBe(true)
    })
  })

  describe('updateUserStatistics', () => {
    it('increments games played on loss', async () => {
      await store.dispatch('updateUserStatistics', { game_won_bool: false, level: 1 })
      expect(localStorage.getItem('numBeginnerGames')).toBe('1')
      expect(localStorage.getItem('numBeginnerWins')).toBe('0')
      expect(store.state.beginnerGamesPlayed).toBe(1)
      expect(store.state.beginnerGamesWon).toBe(0)
    })

    it('increments games played and wins on win', async () => {
      await store.dispatch('updateUserStatistics', { game_won_bool: true, level: 1 })
      expect(localStorage.getItem('numBeginnerGames')).toBe('1')
      expect(localStorage.getItem('numBeginnerWins')).toBe('1')
      expect(store.state.beginnerGamesPlayed).toBe(1)
      expect(store.state.beginnerGamesWon).toBe(1)
    })

    it('works for level 2', async () => {
      await store.dispatch('updateUserStatistics', { game_won_bool: true, level: 2 })
      expect(localStorage.getItem('numIntermediateGames')).toBe('1')
      expect(localStorage.getItem('numIntermediateWins')).toBe('1')
    })

    it('works for level 3', async () => {
      await store.dispatch('updateUserStatistics', { game_won_bool: false, level: 3 })
      expect(localStorage.getItem('numAdvancedGames')).toBe('1')
      expect(localStorage.getItem('numAdvancedWins')).toBe('0')
    })

    it('does nothing for invalid level', async () => {
      await store.dispatch('updateUserStatistics', { game_won_bool: true, level: 99 })
      // No error, no localStorage changes
    })

    it('accumulates statistics over multiple calls', async () => {
      await store.dispatch('updateUserStatistics', { game_won_bool: true, level: 1 })
      await store.dispatch('updateUserStatistics', { game_won_bool: false, level: 1 })
      await store.dispatch('updateUserStatistics', { game_won_bool: true, level: 1 })
      expect(store.state.beginnerGamesPlayed).toBe(3)
      expect(store.state.beginnerGamesWon).toBe(2)
    })
  })
})
