import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mineIndices: [],
    squares: []
  },
  mutations: {
    GET_SQUARES(state, squares) {
      state.squares = squares
    },
    PLACE_MINE(state, mineIndex) {
      state.mineIndices.push(mineIndex)
    }
  },
  actions: {
    getSquares({ commit }, {level}) {
      let squares = Array.from(document.querySelectorAll('.level' + level + ' div'))
      commit('GET_SQUARES', squares)
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