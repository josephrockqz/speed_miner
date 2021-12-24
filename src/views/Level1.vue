<template>

  <div id="levelbox">
    
    <!--Game Panel-->
    <GamePanel/>

    <div class="level1">

      <!--Game Grid-->
      <div v-for="cell in cells"
           :key="cell"
           @click="checkCell(cell)"
           @click.right.prevent="$store.dispatch('placeFlag', {cell_index: cell, level: 1})"></div>

    </div>

  </div>

</template>

<script>
document.body.style.backgroundColor = '#e9e9e9'

import GamePanel from '../components/GamePanel.vue'
import { mapState, mapActions } from 'vuex'
import store from '../store.js'

export default {
  components: {
    GamePanel
  },
  computed: {
    ...mapState({
      cells: 'cells',
      mineIndices: 'mineIndices',
      squares: 'squares',
      squaresBool: 'squaresBool'
    })
  },
  data() {
    return {
      num_cells: 100,
      width: 420
    }
  },
  methods: {
    checkCell(cell_index) {
      // get square divs if haven't already
      if (this.squaresBool == false) {
        store.dispatch('getSquares', {
          level: 1
        })
      }
      // empty cell is clicked
      if (!this.mineIndices.includes(cell_index) && !this.squares[cell_index].classList.contains('flag')) {
        this.squares[cell_index].classList.add('uncovered')
        let num_neighbor_mines = this.getNeighborMines(cell_index)
        this.squares[cell_index].innerText = num_neighbor_mines
      } 
      // mine is clicked
      else if (this.mineIndices.includes(cell_index) && !this.squares[cell_index].classList.contains('flag')) {
        let image_element = new Image(40,40)
        image_element.src = "/src/assets/mine.png"
        image_element.setAttribute("height", "40");
        image_element.setAttribute("width", "40");
        // this.squares[this.mineIndices[i]].appendChild(image_element)
        this.squares[cell_index].classList.add('mine')
        this.gameOver()
      }
    },
    getNeighborMines(cell_index) {
      let mine_counter = 0
      // upper cell
      if (cell_index - 10 >= 0 && this.mineIndices.includes(cell_index - 10)) {
        mine_counter++
      }
      // lower cell
      if (cell_index + 10 <= 99 && this.mineIndices.includes(cell_index + 10)) {
        mine_counter++
      }
      // left cell
      if (cell_index % 10 != 0 && this.mineIndices.includes(cell_index - 1)) {
        mine_counter++
      }
      // right cell
      if (cell_index % 10 != 9 && this.mineIndices.includes(cell_index + 1)) {
        mine_counter++
      }
      // upper left cell
      if (cell_index % 10 != 0 && cell_index - 10 >= 0 && this.mineIndices.includes(cell_index - 11)) {
        mine_counter++
      }
      // upper right cell
      if (cell_index % 10 != 9 && cell_index - 10 >= 0 && this.mineIndices.includes(cell_index - 9)) {
        mine_counter++
      }
      // lower left cell
      if (cell_index % 10 != 0 && cell_index + 10 <= 99 && this.mineIndices.includes(cell_index + 9)) {
        mine_counter++
      }
      // lower right cell
      if (cell_index % 10 != 9 && cell_index + 10 <= 99 && this.mineIndices.includes(cell_index + 11)) {
        mine_counter++
      }
      return mine_counter
    },
    gameOver() {
      let level_box = document.getElementById('levelbox')
      let game_over = document.createElement('h1')
      game_over.innerText = "GAME OVER"
      level_box.appendChild(game_over)
    },
    ...mapActions([
      'getSquares',
      'makeCells',
      'placeFlag',
      'placeMines'
    ])
  },
  mounted() {
    store.dispatch('makeCells', {
      num_cells: this.num_cells
    })
    store.dispatch('placeMines', {
      num_cells: this.num_cells,
      num_mines: 10
    })
  }
}
</script>

<style scoped>
.level1 {
  width: 420px;
  height: 420px;
  flex-wrap: wrap;
  display: flex;
  background-color: #999999;
  border: #000000 10px solid;
  margin: 0 auto;
}
.level1 div {
  height: 40px;
  width: 40px;
  border: #ffffff 1px solid;
  margin: 0px;
  padding: 0px;
}
</style>