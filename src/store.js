import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cells: [],
    gameStartBool: false,
    height: 0,
    mineIndices: [],
    numCells: 0,
    numMines: 0,
    squares: [],
    squaresBool: false,
    width: 0
  },
  mutations: {
    CELL_MINE(state, cell_index) {
      state.squares[cell_index].classList.add('mine')
    },
    CELL_NUMBER(state, payload) {
      state.squares[payload.cell_index].innerText = payload.number
      state.squares[payload.cell_index].style.color = 'black'
      state.squares[payload.cell_index].style.lineHeight = "40px"
    },
    CELL_UNCOVER(state, cell_index) {
      state.squares[cell_index].classList.add('uncovered')
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
    INSTATIATE_RECTANGLE_DIMENSIONS(state, dimensions) {
      state.height = dimensions.height
      state.numCells = dimensions.num_cells
      state.numMines = dimensions.num_mines
      state.width = dimensions.width
    },
    MAKE_CELLS(state, cells) {
      state.cells = cells
    },
    PLACE_MINE(state, mineIndex) {
      state.mineIndices.push(mineIndex)
    },
    SWITCH_GAME_START_BOOL_ON(state) {
      state.gameStartBool = true
    }
  },
  actions: {
    async checkCell({ commit, dispatch, state }, { cell_index, level }) {
      // get square divs if haven't already
      if (state.squaresBool == false) {
        await dispatch('getSquares', {
          level: level
        })
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
      if (!state.mineIndices.includes(cell_index)) {
        await dispatch('uncoverCell', {
          cell_index: cell_index
        })
      } 
      // mine is clicked
      else if (state.mineIndices.includes(cell_index) && !state.squares[cell_index].classList.contains('flag')) {
        // let image_element = new Image(40,40)
        // image_element.src = "/src/assets/mine.png"
        // image_element.setAttribute("height", "40");
        // image_element.setAttribute("width", "40");
        // this.squares[this.mineIndices[i]].appendChild(image_element)
        commit('CELL_MINE', cell_index)
        await dispatch('gameOver')
      }
    },
    gameOver() {
      let level_box = document.getElementById('levelbox')
      let game_over = document.createElement('h1')
      game_over.innerText = "GAME OVER"
      level_box.appendChild(game_over)
    },
    async getNeighborMinesRectangle({ state }, { cell_index }) {
      let numberOfNeighborMines = 0
      // upper cell
      if (cell_index - state.width >= 0 && state.mineIndices.includes(cell_index - state.width)) {
        numberOfNeighborMines++
      }
      // lower cell
      if (cell_index + state.width <= (state.height * state.width - 1) && state.mineIndices.includes(cell_index + state.width)) {
        numberOfNeighborMines++
      }
      // left cell
      if (cell_index % state.width != 0 && state.mineIndices.includes(cell_index - 1)) {
        numberOfNeighborMines++
      }
      // right cell
      if (cell_index % state.width != (state.width - 1) && state.mineIndices.includes(cell_index + 1)) {
        numberOfNeighborMines++
      }
      // upper left cell
      if (cell_index % state.width != 0 && cell_index - state.width >= 0 && state.mineIndices.includes(cell_index - state.width - 1)) {
        numberOfNeighborMines++
      }
      // upper right cell
      if (cell_index % state.width != (state.width - 1) && cell_index - state.width >= 0 && state.mineIndices.includes(cell_index - state.width + 1)) {
        numberOfNeighborMines++
      }
      // lower left cell
      if (cell_index % state.width != 0 && cell_index + state.width <= (state.height * state.width - 1) && state.mineIndices.includes(cell_index + state.width - 1)) {
        numberOfNeighborMines++
      }
      // lower right cell
      if (cell_index % state.width != (state.width - 1) && cell_index + state.width <= (state.height * state.width - 1) && state.mineIndices.includes(cell_index + state.width + 1)) {
        numberOfNeighborMines++
      }
      return numberOfNeighborMines
    },
    getSquares({ commit }, { level }) {
      let squares = Array.from(document.querySelectorAll('.level' + level + ' div'))
      commit('GET_SQUARES', squares)
    },
    instantiateRectangleDimensions({ commit }, { height, num_cells, num_mines, width }) {
      commit('INSTATIATE_RECTANGLE_DIMENSIONS', {
        height: height,
        num_cells: num_cells,
        num_mines: num_mines,
        width: width
      })
    },
    makeCells({ commit }, { num_cells }) {
      let cells = Array.from(Array(num_cells).keys())
      commit('MAKE_CELLS', cells)
    },
    async placeFlag({ commit, dispatch, state }, { cell_index, level }) {
      // get square divs if haven't already
      if (state.squaresBool == false) {
        await dispatch('getSquares', {
          level: level
        })
      }
      // don't place flag if cell is uncovered
      if (state.squares[cell_index].classList.contains('uncovered')) {
        return
      }
      // place flag if one isn't in cell
      if (!state.squares[cell_index].classList.contains('flag')) {
        commit('FLAG_ADD', cell_index)
        // this.squares[cell_index].classList.add('flag')
      }
      // remove flag if one is already there
      else {
        commit('FLAG_REMOVE', cell_index)
        // this.squares[cell_index].classList.remove('flag')
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
      console.log(state.numMines)
      while (i < state.numMines) {
        let placement = getRandomInt(state.numCells)
        if (!state.mineIndices.includes(placement) && placement != start_index) {
          // state.mineIndices.push(placement)
          commit('PLACE_MINE', placement)
          i++
        }
      }
    },
    async recurseBlankCellsRectangle({ commit, dispatch, state }, { cell_index }) {
      // first, uncover the cell
      commit('CELL_UNCOVER', cell_index)

      // upper cell
      if (cell_index - state.width >= 0 && !state.mineIndices.includes(cell_index - state.width)) {
        dispatch('uncoverCell', {
          cell_index: cell_index - state.width
        })
      }
      // lower cell
      if (cell_index + state.width <= (state.height * state.width - 1) && !state.mineIndices.includes(cell_index + state.width)) {
        dispatch('uncoverCell', {
          cell_index: cell_index + state.width
        })
      }
      // left cell
      if (cell_index % state.width != 0 && !state.mineIndices.includes(cell_index - 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index - 1
        })
      }
      // right cell
      if (cell_index % state.width != (state.width - 1) && !state.mineIndices.includes(cell_index + 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index + 1
        })
      }
      // upper left cell
      if (cell_index % state.width != 0 && cell_index - state.width >= 0 && !state.mineIndices.includes(cell_index - state.width - 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index - state.width - 1
        })
      }
      // upper right cell
      if (cell_index % state.width != (state.width - 1) && cell_index - state.width >= 0 && !state.mineIndices.includes(cell_index - state.width + 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index - state.width + 1
        })
      }
      // lower left cell
      if (cell_index % state.width != 0 && cell_index + state.width <= (state.height * state.width - 1) && !state.mineIndices.includes(cell_index + state.width - 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index + state.width - 1
        })
      }
      // lower right cell
      if (cell_index % state.width != (state.width - 1) && cell_index + state.width <= (state.height * state.width - 1) && !state.mineIndices.includes(cell_index + state.width + 1)) {
        dispatch('uncoverCell', {
          cell_index: cell_index + state.width + 1
        })
      }
    },
    async uncoverCell({ commit, dispatch, state }, { cell_index }) {
      if (state.squares[cell_index].classList.contains('uncovered') || state.squares[cell_index].classList.contains('flag') || state.squares[cell_index].classList.contains('mine')) {
        return
      }
      commit('CELL_UNCOVER', cell_index) // uncover cell
      // get number of nearby mines
      dispatch('getNeighborMinesRectangle', {
        cell_index: cell_index
      }).then(payload => {
        console.log(payload)
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
    }
  },
  modules: {}
})