import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cells: [],
    mineIndices: [],
    numberOfNeighborMines: 0,
    squares: [],
    squaresBool: false
  },
  mutations: {
    CELL_MINE(state, cell_index) {
      state.squares[cell_index].classList.add('mine')
    },
    CELL_NUMBER(state, cell_index) {
      state.squares[cell_index].innerText = state.numberOfNeighborMines
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
    INCREMENT_NEIGHBOR_MINES(state) {
      state.numberOfNeighborMines++
    },
    MAKE_CELLS(state, cells) {
      state.cells = cells
    },
    PLACE_MINE(state, mineIndex) {
      state.mineIndices.push(mineIndex)
    },
    RESET_NEIGHBOR_MINES(state) {
      state.numberOfNeighborMines = 0
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
      // empty cell is clicked
      if (!state.mineIndices.includes(cell_index) && !state.squares[cell_index].classList.contains('flag')) {
        commit('CELL_UNCOVER', cell_index)
        await dispatch('getNeighborMinesRectangle', {
          cell_index: cell_index,
          height: 10,
          width: 10
        })
        commit('CELL_NUMBER', cell_index)
        await dispatch('resetNeighborMines')
      } 
      // mine is clicked
      else if (state.mineIndices.includes(cell_index) && !state.squares[cell_index].classList.contains('flag')) {
        let image_element = new Image(40,40)
        image_element.src = "/src/assets/mine.png"
        image_element.setAttribute("height", "40");
        image_element.setAttribute("width", "40");
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
    getNeighborMinesRectangle({ commit, state }, { cell_index, height, width }) {
      // upper cell
      if (cell_index - width >= 0 && state.mineIndices.includes(cell_index - width)) {
        commit('INCREMENT_NEIGHBOR_MINES')
      }
      // lower cell
      if (cell_index + width <= (height * width - 1) && state.mineIndices.includes(cell_index + width)) {
        commit('INCREMENT_NEIGHBOR_MINES')
      }
      // left cell
      if (cell_index % width != 0 && state.mineIndices.includes(cell_index - 1)) {
        commit('INCREMENT_NEIGHBOR_MINES')
      }
      // right cell
      if (cell_index % width != (width - 1) && state.mineIndices.includes(cell_index + 1)) {
        commit('INCREMENT_NEIGHBOR_MINES')
      }
      // upper left cell
      if (cell_index % width != 0 && cell_index - width >= 0 && state.mineIndices.includes(cell_index - width - 1)) {
        commit('INCREMENT_NEIGHBOR_MINES')
      }
      // upper right cell
      if (cell_index % width != (width - 1) && cell_index - width >= 0 && state.mineIndices.includes(cell_index - width + 1)) {
        commit('INCREMENT_NEIGHBOR_MINES')
      }
      // lower left cell
      if (cell_index % width != 0 && cell_index + width <= (height * width - 1) && state.mineIndices.includes(cell_index + width - 1)) {
        commit('INCREMENT_NEIGHBOR_MINES')
      }
      // lower right cell
      if (cell_index % width != (width - 1) && cell_index + width <= (height * width - 1) && state.mineIndices.includes(cell_index + width + 1)) {
        commit('INCREMENT_NEIGHBOR_MINES')
      }
    },
    getSquares({ commit }, { level }) {
      let squares = Array.from(document.querySelectorAll('.level' + level + ' div'))
      commit('GET_SQUARES', squares)
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
    placeMines({ commit, state }, { num_cells, num_mines }) {
      // function to get random integer in range of
      // number of cells in the level
      function getRandomInt(max) {
        return Math.floor(Math.random() * max)
      }
      // code snippet gets the indices for the random
      // placement of the mines in the level
      let i = 0
      while (i < num_mines) {
        let placement = getRandomInt(num_cells)
        if (!state.mineIndices.includes(placement)) {
          // state.mineIndices.push(placement)
          commit('PLACE_MINE', placement)
          i++
        }
      }
    },
    resetNeighborMines({ commit }) {
      commit('RESET_NEIGHBOR_MINES')
    }
  },
  modules: {}
})