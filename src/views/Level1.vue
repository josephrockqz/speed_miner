<template>

  <div id="levelbox">
    
    <!--Game Panel-->
    <GamePanel/>

    <div class="main-grid">

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

export default {
  components: {
    GamePanel
  },
  data() {
    return {
      cells: [],
      getSquaresBool: false,
      mineIndices: [],
      squares: [],
      width: 420
    }
  },
  methods: {
    checkCell(cell_index) {
      // get square divs if haven't already
      if (this.getSquaresBool == false) {
        this.getSquares()
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
    getSquares() {
      this.squares = Array.from(document.querySelectorAll('.main-grid div'))
    },
    makeCells(num_cells) {
      this.cells = Array.from(Array(num_cells).keys())
    },
    placeFlag(cell_index) {
      // get square divs if haven't already
      if (this.getSquaresBool == false) {
        this.getSquares()
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
    placeMines(num_cells, num_mines) {
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
        if (!this.mineIndices.includes(placement)) {
          this.mineIndices.push(placement)
          i++
        }
      }
    }
  },
  mounted() {
    console.log("hello")
    this.makeCells(100)
    this.getSquares()
    this.placeMines(100, 10)
  }
}
</script>

<style scoped>

</style>