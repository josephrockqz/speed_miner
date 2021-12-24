import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cells: [],
    mineIndices: [],
    squares: [],
    squaresBool: false
  },
  mutations: {
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
    MAKE_CELLS(state, cells) {
      state.cells = cells
    },
    PLACE_MINE(state, mineIndex) {
      state.mineIndices.push(mineIndex)
    }
  },
  actions: {
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
    }
  },
  modules: {}
})