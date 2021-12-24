<template>

  <div id="levelbox">
    
    <!--Game Panel-->
    <GamePanel/>

    <div class="level1">

      <!--Game Grid-->
      <div v-for="cell in cells"
           :key="cell"
           @click="checkCell(cell)"
           @click.right.prevent="placeFlag(cell)"></div>

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
      mineIndices: 'mineIndices',
      squares: 'squares'
    })
  },
  data() {
    return {
      cells: [],
      getSquaresBool: false,
      width: 420
    }
  },
  methods: {
    checkCell(cell_index) {
      // get square divs if haven't already
      if (this.getSquaresBool == false) {
        store.dispatch('getSquares', {
          level: 1
        })
        this.getSquaresBool = true
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
    makeCells(num_cells) {
      this.cells = Array.from(Array(num_cells).keys())
    },
    placeFlag(cell_index) {
      // get square divs if haven't already
      if (this.getSquaresBool == false) {
        store.dispatch('getSquares', {
          level: 1
        })
        this.getSquaresBool = true
      }
      // don't place flag if cell is uncovered
      if (this.squares[cell_index].classList.contains('uncovered')) {
        return
      }
      // place flag if one isn't in cell
      if (!this.squares[cell_index].classList.contains('flag')) {
        this.squares[cell_index].classList.add('flag')
      }
      // remove flag if one is already there
      else {
        this.squares[cell_index].classList.remove('flag')
      }
    },
    ...mapActions([
      'getSquares',
      'placeMines'
    ])
  },
  mounted() {
    this.makeCells(100)
    store.dispatch('placeMines', {
      num_cells: 100,
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