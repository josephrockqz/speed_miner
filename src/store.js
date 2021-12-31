import Vue from 'vue'
import Vuex from 'vuex'
import EventServiceMongo from './services/EventServiceMongo'

Vue.use(Vuex)

export default new Vuex.Store({
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
      state.errors.push(error)
    },
    CELL_MINE(state, cell_index) {
      state.squares[cell_index].classList.add('mine')
    },
    CELL_MINE_DEATH(state, cell_index) {
      state.squares[cell_index].classList.add('mine-death')
    },
    CELL_NUMBER(state, payload) {
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
      state.squares[cell_index].classList.add('uncovered')
    },
    CLOSE_GAME_LOSS_MODAL(state) {
      state.gameLossModalBool = false
    },
    CLOSE_GAME_WIN_MODAL(state) {
      state.gameWinModalBool = false
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
      state.squares[cell_index].classList.add('flag')
    },
    FLAG_REMOVE(state, cell_index) {
      state.squares[cell_index].classList.remove('flag')
    },
    GET_SQUARES(state, squares) {
      state.squares = squares
      state.squaresBool = true
    },
    INCREMENT_MINE_COUNTER(state) {
      state.numMinesLeft++
    },
    INSTATIATE_RECTANGLE_LEVEL(state, dimensions) {
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
    RESET_TIME_ELPASED(state) {
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
      if (zoom_level == 1) {
        document.body.style.zoom = "50%"
      } else if (zoom_level == 2) {
        document.body.style.zoom = "75%"
      } else if (zoom_level == 3) {
        document.body.style.zoom = "100%"
      } else if (zoom_level == 4) {
        document.body.style.zoom = "150%"
      } else if (zoom_level == 5) {
        document.body.style.zoom = "200%"
      } 
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
      if (!state.squares[cell_index].classList.contains('uncovered') || state.squares[cell_index].innerText == 0) {
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
      commit('END_TIMER')
      commit('DISABLE_GRID')
      commit('SWITCH_GAME_START_BOOL_OFF')
      await dispatch('revealGridAfterLoss')
      await dispatch('updateUserStatistics', {
        game_won_bool: false,
        level: level,
      })
      // state.gameLossModalBool = true // uncomment this to reinstantiate modal after game loss
    },
    async gameWin({ commit, dispatch, state }, { level }) {
      commit('END_TIMER')
      commit('DISABLE_GRID')
      commit('SWITCH_GAME_START_BOOL_OFF')
      commit('ZERO_MINE_COUNTER')
      await dispatch('revealGridAfterWin')
      await dispatch('updateUserStatistics', {
        game_won_bool: true,
        level: level,
      })
      state.gameWinModalBool = true
    },
    getNeighborMinesRectangle({ state }, { cell_index }) {
      let numberOfNeighborMines = 0
      // upper cell
      if (cell_index - state.width >= 0 && state.mineIndices.has(cell_index - state.width)) {
        numberOfNeighborMines++
      }
      // lower cell
      if (cell_index + state.width <= (state.height * state.width - 1) && state.mineIndices.has(cell_index + state.width)) {
        numberOfNeighborMines++
      }
      // left cell
      if (cell_index % state.width != 0 && state.mineIndices.has(cell_index - 1)) {
        numberOfNeighborMines++
      }
      // right cell
      if (cell_index % state.width != (state.width - 1) && state.mineIndices.has(cell_index + 1)) {
        numberOfNeighborMines++
      }
      // upper left cell
      if (cell_index % state.width != 0 && cell_index - state.width >= 0 && state.mineIndices.has(cell_index - state.width - 1)) {
        numberOfNeighborMines++
      }
      // upper right cell
      if (cell_index % state.width != (state.width - 1) && cell_index - state.width >= 0 && state.mineIndices.has(cell_index - state.width + 1)) {
        numberOfNeighborMines++
      }
      // lower left cell
      if (cell_index % state.width != 0 && cell_index + state.width <= (state.height * state.width - 1) && state.mineIndices.has(cell_index + state.width - 1)) {
        numberOfNeighborMines++
      }
      // lower right cell
      if (cell_index % state.width != (state.width - 1) && cell_index + state.width <= (state.height * state.width - 1) && state.mineIndices.has(cell_index + state.width + 1)) {
        numberOfNeighborMines++
      }
      return numberOfNeighborMines
    },
    getNumberOfNeighborFlags({ state }, { cell_index }) {
      let numberOfNeighborFlags = 0
      // upper cell
      if (cell_index - state.width >= 0 && state.squares[cell_index - state.width].classList.contains('flag')) {
        numberOfNeighborFlags++
      }
      // lower cell
      if (cell_index + state.width <= (state.height * state.width - 1) && state.squares[cell_index + state.width].classList.contains('flag')) {
        numberOfNeighborFlags++
      }
      // left cell
      if (cell_index % state.width != 0 && state.squares[cell_index - 1].classList.contains('flag')) {
        numberOfNeighborFlags++
      }
      // right cell
      if (cell_index % state.width != (state.width - 1) && state.squares[cell_index + 1].classList.contains('flag')) {
        numberOfNeighborFlags++
      }
      // upper left cell
      if (cell_index % state.width != 0 && cell_index - state.width >= 0 && state.squares[cell_index - state.width - 1].classList.contains('flag')) {
        numberOfNeighborFlags++
      }
      // upper right cell
      if (cell_index % state.width != (state.width - 1) && cell_index - state.width >= 0 && state.squares[cell_index - state.width + 1].classList.contains('flag')) {
        numberOfNeighborFlags++
      }
      // lower left cell
      if (cell_index % state.width != 0 && cell_index + state.width <= (state.height * state.width - 1) && state.squares[cell_index + state.width - 1].classList.contains('flag')) {
        numberOfNeighborFlags++
      }
      // lower right cell
      if (cell_index % state.width != (state.width - 1) && cell_index + state.width <= (state.height * state.width - 1) && state.squares[cell_index + state.width + 1].classList.contains('flag')) {
        numberOfNeighborFlags++
      }
      return numberOfNeighborFlags
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
      let games_so_far
      let wins_so_far
      games_so_far = localStorage.getItem("numBeginnerGames")
      wins_so_far = localStorage.getItem("numBeginnerWins")
      if (games_so_far == null) {
        games_so_far = 0
      }
      if (wins_so_far == null) {
        wins_so_far = 0
      }
      commit('SET_BEGINNER_STATISTICS', {
        num_games: games_so_far,
        num_wins: wins_so_far
      })
      games_so_far = localStorage.getItem("numIntermediateGames")
      wins_so_far = localStorage.getItem("numIntermediateWins")
      if (games_so_far == null) {
        games_so_far = 0
      }
      if (wins_so_far == null) {
        wins_so_far = 0
      }
      commit('SET_INTERMEDIATE_STATISTICS', {
        num_games: games_so_far,
        num_wins: wins_so_far
      })
      games_so_far = localStorage.getItem("numAdvancedGames")
      wins_so_far = localStorage.getItem("numAdvancedWins")
      if (games_so_far == null) {
        games_so_far = 0
      }
      if (wins_so_far == null) {
        wins_so_far = 0
      }
      commit('SET_ADVANCED_STATISTICS', {
        num_games: games_so_far,
        num_wins: wins_so_far
      })
    },
    instantiateRectangleLevel({ commit }, { height, level, num_cells, num_mines, width }) {
      commit('INSTATIATE_RECTANGLE_LEVEL', {
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
      if (state.disableGridBool == true) {
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
      }
      // remove flag if one is already there
      else {
        commit('FLAG_REMOVE', cell_index)
        commit('INCREMENT_MINE_COUNTER')
      }
    },
    placeMines({ commit, state }, { start_index }) {
      // function to get random integer in range of
      // number of cells in the level
      function getRandomInt(max) {
        return Math.floor(Math.random() * max)
      }
      // code snippet gets the indices for the random
      // placement of the mines in the level
      let i = 0
      while (i < state.numMines) {
        let placement = getRandomInt(state.numCells)
        if (!state.mineIndices.has(placement) && placement != start_index) {
          // state.mineIndices.add(placement)
          commit('PLACE_MINE', placement)
          i++
        }
      }
    },
    postScoreMongo({ commit }, { level, name, time }) {
      EventServiceMongo.insertScore(level, name, time).catch(error => {
        commit('ADD_ERROR', error)
      })
    },
    recurseBlankCellsRectangle({ commit, dispatch, state }, { cell_index }) {
      // first, uncover the cell if it needs to be
      if (!state.squares[cell_index].classList.contains('uncovered')) {
        commit('CELL_UNCOVER', cell_index)
      }

      // upper cell
      if (cell_index - state.width >= 0 && !state.mineIndices.has(cell_index - state.width)) {
        dispatch('uncoverCell', {
          cell_index: cell_index - state.width
        })
      }
      // lower cell
      if (cell_index + state.width <= (state.height * state.width - 1) && !state.mineIndices.has(cell_index + state.width)) {
        dispatch('uncoverCell', {
          cell_index: cell_index + state.width
        })
      }
      // left cell
      if (cell_index % state.width != 0 && !state.mineIndices.has(cell_index - 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index - 1
        })
      }
      // right cell
      if (cell_index % state.width != (state.width - 1) && !state.mineIndices.has(cell_index + 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index + 1
        })
      }
      // upper left cell
      if (cell_index % state.width != 0 && cell_index - state.width >= 0 && !state.mineIndices.has(cell_index - state.width - 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index - state.width - 1
        })
      }
      // upper right cell
      if (cell_index % state.width != (state.width - 1) && cell_index - state.width >= 0 && !state.mineIndices.has(cell_index - state.width + 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index - state.width + 1
        })
      }
      // lower left cell
      if (cell_index % state.width != 0 && cell_index + state.width <= (state.height * state.width - 1) && !state.mineIndices.has(cell_index + state.width - 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index + state.width - 1
        })
      }
      // lower right cell
      if (cell_index % state.width != (state.width - 1) && cell_index + state.width <= (state.height * state.width - 1) && !state.mineIndices.has(cell_index + state.width + 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index + state.width + 1
        })
      }
    },
    restartGame({ commit, state }) {
      if (state.squaresBool == true) {
        commit('ENABLE_GRID')
        commit('END_TIMER')
        commit('RESET_MINES')
        commit('RESET_TIME_ELPASED')
        commit('RESET_MINE_COUNTER')
        for (let i = 0; i < state.numCells; i++) {
          state.squares[i].removeAttribute('class')
          state.squares[i].innerText = ''
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
    timeExceeded({ commit, dispatch }, { level }) {
      // ran out of time - game over
      dispatch('gameLoss', {
        level: level
      })
      // create some sort of alert that you lost
      // because time was exceeded
      alert('You lost because maximum time of 999 seconds was exceeded')
      // set timeElapsed to 999
      commit('SET_TIME_ELAPSED_MAX')
    },
    toggleNightMode({ commit }, { night_mode_bool }) {
      commit('TOGGLE_NIGHT_MODE', night_mode_bool)
    },
    toggleZoom({ commit }, { zoom_level }) {
      commit('TOGGLE_ZOOM', zoom_level)
    },
    uncoverCell({ commit, dispatch, state }, { cell_index }) {
      if (state.squares[cell_index].classList.contains('uncovered') || state.squares[cell_index].classList.contains('flag') || state.squares[cell_index].classList.contains('mine')) {
        return
      }
      commit('CELL_UNCOVER', cell_index) // uncover cell
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
      // upper cell
      if (cell_index - state.width >= 0) {
        if (!state.mineIndices.has(cell_index - state.width)) {
          dispatch('uncoverCell', {
            cell_index: cell_index - state.width
          })
        }
        else if (state.mineIndices.has(cell_index - state.width) && !state.squares[cell_index - state.width].classList.contains('flag')) {
          commit('CELL_MINE_DEATH', cell_index - state.width)
          dispatch('gameLoss', {
            level: level
          })
        }
      }
      // lower cell
      if (cell_index + state.width <= (state.height * state.width - 1)) {
        if (!state.mineIndices.has(cell_index + state.width)) {
          dispatch('uncoverCell', {
            cell_index: cell_index + state.width
          })
        }
        else if (state.mineIndices.has(cell_index + state.width) && !state.squares[cell_index + state.width].classList.contains('flag')) {
          commit('CELL_MINE_DEATH', cell_index + state.width)
          dispatch('gameLoss', {
            level: level
          })
        }
      }
      // left cell
      if (cell_index % state.width != 0) {
        if (!state.mineIndices.has(cell_index - 1)) {
          dispatch('uncoverCell', {
            cell_index: cell_index - 1
          })
        }
        else if (state.mineIndices.has(cell_index - 1) && !state.squares[cell_index - 1].classList.contains('flag')) {
          commit('CELL_MINE_DEATH', cell_index - 1)
          dispatch('gameLoss', {
            level: level
          })
        }
      }
      // right cell
      if (cell_index % state.width != (state.width - 1)) {
        if (!state.mineIndices.has(cell_index + 1)) {
          dispatch('uncoverCell', {
            cell_index: cell_index + 1
          })
        }
        else if (state.mineIndices.has(cell_index + 1) && !state.squares[cell_index + 1].classList.contains('flag')) {
          commit('CELL_MINE_DEATH', cell_index + 1)
          dispatch('gameLoss', {
            level: level
          })
        }
      }
      // upper left cell
      if (cell_index % state.width != 0 && cell_index - state.width >= 0) {
        if (!state.mineIndices.has(cell_index - state.width - 1)) {
          dispatch('uncoverCell', {
            cell_index: cell_index - state.width - 1
          })
        }
        else if (state.mineIndices.has(cell_index - state.width - 1) && !state.squares[cell_index - state.width - 1].classList.contains('flag')) {
          commit('CELL_MINE_DEATH', cell_index - state.width - 1)
          dispatch('gameLoss', {
            level: level
          })
        }
      }
      // upper right cell
      if (cell_index % state.width != (state.width - 1) && cell_index - state.width >= 0) {
        if (!state.mineIndices.has(cell_index - state.width + 1)) {
          dispatch('uncoverCell', {
            cell_index: cell_index - state.width + 1
          })
        }
        else if (state.mineIndices.has(cell_index - state.width + 1) && !state.squares[cell_index - state.width + 1].classList.contains('flag')) {
          commit('CELL_MINE_DEATH', cell_index - state.width + 1)
          dispatch('gameLoss', {
            level: level
          })
        }
      }
      // lower left cell
      if (cell_index % state.width != 0 && cell_index + state.width <= (state.height * state.width - 1)) {
        if (!state.mineIndices.has(cell_index + state.width - 1)) {
          dispatch('uncoverCell', {
            cell_index: cell_index + state.width - 1
          })
        }
        else if (state.mineIndices.has(cell_index + state.width - 1) && !state.squares[cell_index + state.width - 1].classList.contains('flag')) {
          commit('CELL_MINE_DEATH', cell_index + state.width - 1)
          dispatch('gameLoss', {
            level: level
          })
        }
      }
      // lower right cell
      if (cell_index % state.width != (state.width - 1) && cell_index + state.width <= (state.height * state.width - 1)) {
        if (!state.mineIndices.has(cell_index + state.width + 1)) {
          dispatch('uncoverCell', {
            cell_index: cell_index + state.width + 1
          })
        }
        else if (state.mineIndices.has(cell_index + state.width + 1) && !state.squares[cell_index + state.width + 1].classList.contains('flag')) {
          commit('CELL_MINE_DEATH', cell_index + state.width + 1)
          dispatch('gameLoss', {
            level: level
          })
        }
      }
    },
    updateUserStatistics({ commit }, { game_won_bool, level}) {
      // update user statistics using local storage
      let games_so_far
      let wins_so_far
      if (level == 1) {
        games_so_far = localStorage.getItem("numBeginnerGames")
        wins_so_far = localStorage.getItem("numBeginnerWins")
        if (games_so_far == null) {
          games_so_far = 0
        }
        if (wins_so_far == null) {
          wins_so_far = 0
        }
        games_so_far++
        if (game_won_bool == true) {
          wins_so_far++
        }
        localStorage.setItem('numBeginnerGames', games_so_far)
        localStorage.setItem('numBeginnerWins', wins_so_far)
        commit('SET_BEGINNER_STATISTICS', {
          num_games: games_so_far,
          num_wins: wins_so_far
        })
      } else if (level == 2) {
        games_so_far = localStorage.getItem("numIntermediateGames")
        wins_so_far = localStorage.getItem("numIntermediateWins")
        if (games_so_far == null) {
          games_so_far = 0
        }
        if (wins_so_far == null) {
          wins_so_far = 0
        }
        games_so_far++
        if (game_won_bool == true) {
          wins_so_far++
        }
        localStorage.setItem('numIntermediateGames', games_so_far)
        localStorage.setItem('numIntermediateWins', wins_so_far)
        commit('SET_INTERMEDIATE_STATISTICS', {
          num_games: games_so_far,
          num_wins: wins_so_far
        })
      } else if (level == 3) {
        games_so_far = localStorage.getItem("numAdvancedGames")
        wins_so_far = localStorage.getItem("numAdvancedWins")
        if (games_so_far == null) {
          games_so_far = 0
        }
        if (wins_so_far == null) {
          wins_so_far = 0
        }
        games_so_far++
        if (game_won_bool == true) {
          wins_so_far++
        }
        localStorage.setItem('numAdvancedGames', games_so_far)
        localStorage.setItem('numAdvancedWins', wins_so_far)
        commit('SET_ADVANCED_STATISTICS', {
          num_games: games_so_far,
          num_wins: wins_so_far
        })
      }
    }
  },
  modules: {}
})