import Vue from 'vue'
import Vuex from 'vuex'
import EventServiceMongo from './services/EventServiceMongo'
import { playReveal, playFlag, playUnflag, playExplosion, playWin } from './services/SoundService'

Vue.use(Vuex)

export function getNeighborIndices(cell_index, width, height) {
  const maxIndex = height * width - 1
  const neighbors = []
  const notLeftEdge = cell_index % width != 0
  const notRightEdge = cell_index % width != (width - 1)
  const notTopEdge = cell_index - width >= 0
  const notBottomEdge = cell_index + width <= maxIndex
  if (notTopEdge) neighbors.push(cell_index - width)
  if (notBottomEdge) neighbors.push(cell_index + width)
  if (notLeftEdge) neighbors.push(cell_index - 1)
  if (notRightEdge) neighbors.push(cell_index + 1)
  if (notLeftEdge && notTopEdge) neighbors.push(cell_index - width - 1)
  if (notRightEdge && notTopEdge) neighbors.push(cell_index - width + 1)
  if (notLeftEdge && notBottomEdge) neighbors.push(cell_index + width - 1)
  if (notRightEdge && notBottomEdge) neighbors.push(cell_index + width + 1)
  return neighbors
}

export function isValidIndex(cell_index, state) {
  return cell_index >= 0 && cell_index < state.numCells && state.squares[cell_index] != null
}

export function createStoreConfig() {
  return {
    state: {
      advancedGamesPlayed: 0,
    advancedGamesWon: 0,
    backgroundColor: '#e9e9e9',
    beginnerGamesPlayed: 0,
    beginnerGamesWon: 0,
    cells: [],
    disableGridBool: false,
    gameLossModalBool: false,
    gameStartBool: false,
    gameWinModalBool: false,
    errors: [],
    height: 0,
    level: 0,
    intermediateGamesPlayed: 0,
    intermediateGamesWon: 0,
    mineIndices: new Set(),
    nightModeBool: false,
    numCells: 0,
    numMines: 0,
    numMinesLeft: 0,
    squares: [],
    squaresBool: false,
    startTime: null,
    timeElapsed: 0,
    timer: null,
    times: [],
    width: 0
  },
  mutations: {
    ADD_ERROR(state, error) {
      const message = (error && error.message) ? error.message : 'An unknown error occurred'
      state.errors.push(message)
    },
    CELL_MINE(state, cell_index) {
      if (!isValidIndex(cell_index, state)) return
      state.squares[cell_index].classList.add('mine')
    },
    CELL_MINE_DEATH(state, cell_index) {
      if (!isValidIndex(cell_index, state)) return
      state.squares[cell_index].classList.add('mine-death')
    },
    CELL_NUMBER(state, payload) {
      if (!isValidIndex(payload.cell_index, state)) return
      state.squares[payload.cell_index].innerText = payload.number
      state.squares[payload.cell_index].style.lineHeight = "40px"
      state.squares[payload.cell_index].style.fontSize = 'x-large'
      if (payload.number == 1) {
        state.squares[payload.cell_index].style.color = 'blue'
      } else if (payload.number == 2) {
        state.squares[payload.cell_index].style.color = 'green'
      } else if (payload.number == 3) {
        state.squares[payload.cell_index].style.color = 'red'
      } else if (payload.number == 4) {
        state.squares[payload.cell_index].style.color = 'purple'
      } else if (payload.number == 5) {
        state.squares[payload.cell_index].style.color = 'maroon'
      } else if (payload.number == 6) {
        state.squares[payload.cell_index].style.color = 'orange'
      } else if (payload.number == 7) {
        state.squares[payload.cell_index].style.color = 'brown'
      } else if (payload.number == 8) {
        state.squares[payload.cell_index].style.color = '#000000'
      }
    },
    CELL_UNCOVER(state, cell_index) {
      if (!isValidIndex(cell_index, state)) return
      state.squares[cell_index].classList.add('uncovered')
    },
    CLOSE_GAME_LOSS_MODAL(state) {
      state.gameLossModalBool = false
    },
    OPEN_GAME_LOSS_MODAL(state) {
      state.gameLossModalBool = true
    },
    CLOSE_GAME_WIN_MODAL(state) {
      state.gameWinModalBool = false
    },
    OPEN_GAME_WIN_MODAL(state) {
      state.gameWinModalBool = true
    },
    DECREMENT_MINE_COUNTER(state) {
      state.numMinesLeft--
    },
    DISABLE_GRID(state) {
      state.disableGridBool = true
    },
    ENABLE_GRID(state) {
      state.disableGridBool = false
      state.squaresBool = false
      state.gameStartBool = false
    },
    END_TIMER(state) {
      clearInterval(state.timer)
    },
    FLAG_ADD(state, cell_index) {
      if (!isValidIndex(cell_index, state)) return
      state.squares[cell_index].classList.add('flag')
    },
    FLAG_REMOVE(state, cell_index) {
      if (!isValidIndex(cell_index, state)) return
      state.squares[cell_index].classList.remove('flag')
    },
    GET_SQUARES(state, squares) {
      state.squares = squares
      state.squaresBool = true
    },
    INCREMENT_MINE_COUNTER(state) {
      state.numMinesLeft++
    },
    INSTANTIATE_RECTANGLE_LEVEL(state, dimensions) {
      state.height = dimensions.height
      state.level = dimensions.level
      state.numCells = dimensions.num_cells
      state.numMines = dimensions.num_mines
      state.numMinesLeft = dimensions.num_mines
      state.width = dimensions.width
    },
    MAKE_CELLS(state, cells) {
      state.cells = cells
    },
    PLACE_MINE(state, mineIndex) {
      state.mineIndices.add(mineIndex)
    },
    RESET_MINE_COUNTER(state) {
      state.numMinesLeft = state.numMines
    },
    RESET_MINES(state) {
      state.mineIndices = new Set()
    },
    RESET_TIME_ELAPSED(state) {
      state.timeElapsed = 0
    },
    SET_BEGINNER_STATISTICS(state, payload) {
      state.beginnerGamesPlayed = payload.num_games
      state.beginnerGamesWon = payload.num_wins
    },
    SET_INTERMEDIATE_STATISTICS(state, payload) {
      state.intermediateGamesPlayed = payload.num_games
      state.intermediateGamesWon = payload.num_wins
    },
    SET_ADVANCED_STATISTICS(state, payload) {
      state.advancedGamesPlayed = payload.num_games
      state.advancedGamesWon = payload.num_wins
    },
    SET_SCORES(state, data) {
      state.times = data
    },
    SET_TIME_ELAPSED_MAX(state) {
      state.timeElapsed = 999
    },
    START_TIMER(state) {
      if (state.timer) clearInterval(state.timer)
      state.timer = window.setInterval(() => {
        let current_time = Date.now()
        let time_elapsed = current_time - state.startTime
        time_elapsed /= 1000
        time_elapsed = Math.round(time_elapsed)
        state.timeElapsed = time_elapsed
      }, 1000)
    },
    SET_START_TIME(state) {
      let start_time = Date.now()
      state.startTime = start_time
    },
    SWITCH_GAME_START_BOOL_ON(state) {
      state.gameStartBool = true
    },
    SWITCH_GAME_START_BOOL_OFF(state) {
      state.gameStartBool = false
    },
    TOGGLE_NIGHT_MODE(state, night_mode_bool) {
      state.nightModeBool = night_mode_bool
      if (night_mode_bool == false) {
        state.backgroundColor = '#e9e9e9'
      } else {
        state.backgroundColor = '#555555'
      }
    },
    TOGGLE_ZOOM(state, zoom_level) {
      const zoomMap = { 1: '50%', 2: '75%', 3: '100%', 4: '150%', 5: '200%' }
      const zoom = zoomMap[zoom_level]
      if (zoom) document.body.style.zoom = zoom
    },
    ZERO_MINE_COUNTER(state) {
      state.numMinesLeft = 0
    }
  },
  actions: {
    async checkCell({ commit, dispatch, state }, { cell_index, level }) {
      if (state.disableGridBool == true) {
        return
      }
      // get square divs if haven't already
      if (state.squaresBool == false) {
        await dispatch('getSquares')
        await dispatch('startGame')
      }
      // if this is first cell being clicked, place mines
      // this prevents someone from losing on first click
      if (state.gameStartBool == false) {
        await dispatch('placeMines', {
          start_index: cell_index
        }).then(() => {
          commit('SWITCH_GAME_START_BOOL_ON')
        })
      }
      // empty cell is clicked
      if (!state.mineIndices.has(cell_index)) {
        // uncover cell
        await dispatch('uncoverCell', {
          cell_index: cell_index
        })
        // see if game is won
        await dispatch('checkGameWon', {
          level: level
        })
      } 
      // mine is clicked
      else if (state.mineIndices.has(cell_index) && !state.squares[cell_index].classList.contains('flag')) {
        commit('CELL_MINE_DEATH', cell_index)
        await dispatch('gameLoss', {
          level: level
        })
      }
    },
    async checkGameWon({ dispatch, state }, { level }) {
      // check to see if uncovered cell is last cell to uncover
        // if so, trigger gameWin action
        // get exact time it took to clear board
        let game_win_bool = true
        for (let i = 0; i < state.numCells; i++) {
          if (!state.mineIndices.has(i) && !state.squares[i].classList.contains('uncovered')) {
            game_win_bool = false
          }
        }
        if (game_win_bool == true) {
          await dispatch('gameWin', {
            level: level
          })
        }
    },
    checkMiddleClick({ dispatch, state }, { cell_index, level }) {
      // first, only continue if cell middle clicked is uncovered and has nearby mines
      if (state.squaresBool == false || !state.squares[cell_index].classList.contains('uncovered') || state.squares[cell_index].innerText == 0) {
        return
      }
      // second, only continue if there is the correct amount of flags nearby
      dispatch('getNumberOfNeighborFlags', {
        cell_index: cell_index
      }).then(payload => {
        if (payload == state.squares[cell_index].innerText) {
          // third, reveal cells around middle click
          // if any mines are stepped on ==> game loss
          dispatch('uncoverMiddleClick', {
            cell_index: cell_index,
            level: level
          }).then(() => {
            // fourth, check to see if game is won
            dispatch('checkGameWon', {
              level: level
            })
          })
        }
      })
    },
    closeGameLossModal({ commit }) {
      commit('CLOSE_GAME_LOSS_MODAL')
    },
    closeGameWinModal({ commit }) {
      commit('CLOSE_GAME_WIN_MODAL')
    },
    async gameLoss({ commit, dispatch }, { level }) {
      playExplosion()
      commit('END_TIMER')
      commit('DISABLE_GRID')
      commit('SWITCH_GAME_START_BOOL_OFF')
      await dispatch('revealGridAfterLoss')
      await dispatch('updateUserStatistics', {
        game_won_bool: false,
        level: level,
      })
      commit('OPEN_GAME_LOSS_MODAL')
    },
    async gameWin({ commit, dispatch }, { level }) {
      playWin()
      commit('END_TIMER')
      commit('DISABLE_GRID')
      commit('SWITCH_GAME_START_BOOL_OFF')
      commit('ZERO_MINE_COUNTER')
      await dispatch('revealGridAfterWin')
      await dispatch('updateUserStatistics', {
        game_won_bool: true,
        level: level,
      })
      commit('OPEN_GAME_WIN_MODAL')
    },
    getNeighborMinesRectangle({ state }, { cell_index }) {
      const neighbors = getNeighborIndices(cell_index, state.width, state.height)
      return neighbors.filter(i => state.mineIndices.has(i)).length
    },
    getNumberOfNeighborFlags({ state }, { cell_index }) {
      const neighbors = getNeighborIndices(cell_index, state.width, state.height)
      return neighbors.filter(i => state.squares[i].classList.contains('flag')).length
    },
    getScoresMongo({ commit }) {
      return EventServiceMongo.getScores()
        .then(response => {
          commit('SET_SCORES', response)
        })
        .catch(error => {
          commit('ADD_ERROR', error)
        })
    },
    getSquares({ commit, state }) {
      let squares = Array.from(document.querySelectorAll('.level' + state.level + ' div'))
      commit('GET_SQUARES', squares)
    },
    getUserStatistics({ commit }) {
      const levels = [
        { gamesKey: 'numBeginnerGames', winsKey: 'numBeginnerWins', mutation: 'SET_BEGINNER_STATISTICS' },
        { gamesKey: 'numIntermediateGames', winsKey: 'numIntermediateWins', mutation: 'SET_INTERMEDIATE_STATISTICS' },
        { gamesKey: 'numAdvancedGames', winsKey: 'numAdvancedWins', mutation: 'SET_ADVANCED_STATISTICS' }
      ]
      levels.forEach(({ gamesKey, winsKey, mutation }) => {
        const num_games = Math.max(0, parseInt(localStorage.getItem(gamesKey), 10) || 0)
        const num_wins = Math.min(num_games, Math.max(0, parseInt(localStorage.getItem(winsKey), 10) || 0))
        commit(mutation, { num_games, num_wins })
      })
    },
    instantiateRectangleLevel({ commit }, { height, level, num_cells, num_mines, width }) {
      commit('INSTANTIATE_RECTANGLE_LEVEL', {
        height: height,
        level: level,
        num_cells: num_cells,
        num_mines: num_mines,
        width: width
      })
    },
    makeCells({ commit }, { num_cells }) {
      let cells = Array.from(Array(num_cells).keys())
      commit('MAKE_CELLS', cells)
    },
    placeFlag({ commit, state }, { cell_index }) {
      if (state.disableGridBool == true || state.squaresBool == false) {
        return
      }
      // don't place flag if cell is uncovered
      if (state.squares[cell_index].classList.contains('uncovered') || state.squares[cell_index].classList.contains('mine')) {
        return
      }
      // place flag if one isn't in cell
      if (!state.squares[cell_index].classList.contains('flag')) {
        commit('FLAG_ADD', cell_index)
        commit('DECREMENT_MINE_COUNTER')
        playFlag()
      }
      // remove flag if one is already there
      else {
        commit('FLAG_REMOVE', cell_index)
        commit('INCREMENT_MINE_COUNTER')
        playUnflag()
      }
    },
    placeMines({ commit, state }, { start_index }) {
      // function to get random integer in range of
      // number of cells in the level
      function getRandomInt(max) {
        return Math.floor(Math.random() * max)
      }
      // build exclusion zone: first-clicked cell + its 3x3 neighborhood
      let excluded = new Set([start_index, ...getNeighborIndices(start_index, state.width, state.height)])

      // place mines, avoiding the exclusion zone
      let i = 0
      while (i < state.numMines) {
        let placement = getRandomInt(state.numCells)
        if (!state.mineIndices.has(placement) && !excluded.has(placement)) {
          commit('PLACE_MINE', placement)
          i++
        }
      }
    },
    postScoreMongo({ commit }, { level, name, time }) {
      return EventServiceMongo.insertScore(level, name, time).catch(error => {
        commit('ADD_ERROR', error)
      })
    },
    recurseBlankCellsRectangle({ commit, dispatch, state }, { cell_index }) {
      if (!state.squares[cell_index].classList.contains('uncovered')) {
        commit('CELL_UNCOVER', cell_index)
      }
      const neighbors = getNeighborIndices(cell_index, state.width, state.height)
      neighbors.forEach(i => {
        if (!state.mineIndices.has(i)) {
          dispatch('uncoverCell', { cell_index: i, silent: true })
        }
      })
    },
    restartGame({ commit, state }) {
      if (state.squaresBool == true) {
        commit('ENABLE_GRID')
        commit('END_TIMER')
        commit('RESET_MINES')
        commit('RESET_TIME_ELAPSED')
        commit('RESET_MINE_COUNTER')
        for (let i = 0; i < state.numCells; i++) {
          state.squares[i].classList.remove('uncovered', 'mine', 'mine-death', 'flag', 'flag-misplaced')
          state.squares[i].innerText = ''
          state.squares[i].style.color = ''
          state.squares[i].style.lineHeight = ''
          state.squares[i].style.fontSize = ''
        }
      }
    },
    revealGridAfterLoss({ commit, state }) {
      for (let i = 0; i < state.numCells; i++) {
        // reveal mines
        if (state.mineIndices.has(i) && !state.squares[i].classList.contains('flag')) {
          commit('CELL_MINE', i)
        }
        // case where flag is incorrectly places
        else if (!state.mineIndices.has(i) && state.squares[i].classList.contains('flag')) {
          state.squares[i].removeAttribute('class')
          state.squares[i].classList.add('flag-misplaced')
        }
      }
    },
    revealGridAfterWin({ commit, state }) {
      for (let i = 0; i < state.numCells; i++) {
        if (state.mineIndices.has(i) && !state.squares[i].classList.contains('flag')) {
          commit('CELL_MINE', i)
        }
      }
    },
    startGame({ commit }) {
      commit('SET_START_TIME')
      commit('START_TIMER')
    },
    async timeExceeded({ commit, dispatch }, { level }) {
      commit('SET_TIME_ELAPSED_MAX')
      await dispatch('gameLoss', {
        level: level
      })
    },
    toggleNightMode({ commit }, { night_mode_bool }) {
      commit('TOGGLE_NIGHT_MODE', night_mode_bool)
    },
    toggleZoom({ commit }, { zoom_level }) {
      commit('TOGGLE_ZOOM', zoom_level)
    },
    uncoverCell({ commit, dispatch, state }, { cell_index, silent }) {
      if (state.squares[cell_index].classList.contains('uncovered') || state.squares[cell_index].classList.contains('flag') || state.squares[cell_index].classList.contains('mine')) {
        return
      }
      commit('CELL_UNCOVER', cell_index) // uncover cell
      if (!silent) playReveal()
      // get number of nearby mines
      dispatch('getNeighborMinesRectangle', {
        cell_index: cell_index
      }).then(payload => {
        // don't show number if there are no neighbor mines
        if (payload == 0) {
          // recursive method to reveal all possible blank cells
          dispatch('recurseBlankCellsRectangle', {
            cell_index: cell_index
          })
        }
        // show number if there is 1 or more mine nearby
        else {
          commit('CELL_NUMBER', {
            cell_index: cell_index,
            number: payload
          })
        }
      })
    },
    uncoverMiddleClick({ commit, dispatch, state }, { cell_index, level }) {
      if (state.disableGridBool == true) {
        return
      }
      let hitMine = false
      const neighbors = getNeighborIndices(cell_index, state.width, state.height)
      neighbors.forEach(i => {
        if (!state.mineIndices.has(i)) {
          dispatch('uncoverCell', { cell_index: i })
        } else if (!state.squares[i].classList.contains('flag')) {
          commit('CELL_MINE_DEATH', i)
          hitMine = true
        }
      })
      if (hitMine) {
        dispatch('gameLoss', { level: level })
      }
    },
    updateUserStatistics({ commit }, { game_won_bool, level }) {
      const levelConfig = {
        1: { gamesKey: 'numBeginnerGames', winsKey: 'numBeginnerWins', mutation: 'SET_BEGINNER_STATISTICS' },
        2: { gamesKey: 'numIntermediateGames', winsKey: 'numIntermediateWins', mutation: 'SET_INTERMEDIATE_STATISTICS' },
        3: { gamesKey: 'numAdvancedGames', winsKey: 'numAdvancedWins', mutation: 'SET_ADVANCED_STATISTICS' }
      }
      const config = levelConfig[level]
      if (!config) return
      let num_games = Math.max(0, (parseInt(localStorage.getItem(config.gamesKey), 10) || 0)) + 1
      let num_wins = Math.min(num_games - 1, Math.max(0, parseInt(localStorage.getItem(config.winsKey), 10) || 0))
      if (game_won_bool) num_wins++
      localStorage.setItem(config.gamesKey, num_games)
      localStorage.setItem(config.winsKey, num_wins)
      commit(config.mutation, { num_games, num_wins })
    }
  },
    modules: {}
  }
}

export default new Vuex.Store(createStoreConfig())