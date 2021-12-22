<template>
  <div id="levelbox">
    <!--Game Grid-->
    <div
      class="main-grid"
    >
      <div @click="checkCell(0)"></div>
      <div @click="checkCell(1)"></div>
      <div @click="checkCell(2)"></div>
      <div @click="checkCell(3)"></div>
      <div @click="checkCell(4)"></div>
      <div @click="checkCell(5)"></div>
      <div @click="checkCell(6)"></div>
      <div @click="checkCell(7)"></div>
      <div @click="checkCell(8)"></div>
      <div @click="checkCell(9)"></div>
      <div @click="checkCell(10)"></div>
      <div @click="checkCell(11)"></div>
      <div @click="checkCell(12)"></div>
      <div @click="checkCell(13)"></div>
      <div @click="checkCell(14)"></div>
      <div @click="checkCell(15)"></div>
      <div @click="checkCell(16)"></div>
      <div @click="checkCell(17)"></div>
      <div @click="checkCell(18)"></div>
      <div @click="checkCell(19)"></div>
      <div @click="checkCell(20)"></div>
      <div @click="checkCell(21)"></div>
      <div @click="checkCell(22)"></div>
      <div @click="checkCell(23)"></div>
      <div @click="checkCell(24)"></div>
      <div @click="checkCell(25)"></div>
      <div @click="checkCell(26)"></div>
      <div @click="checkCell(27)"></div>
      <div @click="checkCell(28)"></div>
      <div @click="checkCell(29)"></div>
      <div @click="checkCell(30)"></div>
      <div @click="checkCell(31)"></div>
      <div @click="checkCell(32)"></div>
      <div @click="checkCell(33)"></div>
      <div @click="checkCell(34)"></div>
      <div @click="checkCell(35)"></div>
      <div @click="checkCell(36)"></div>
      <div @click="checkCell(37)"></div>
      <div @click="checkCell(38)"></div>
      <div @click="checkCell(39)"></div>
      <div @click="checkCell(40)"></div>
      <div @click="checkCell(41)"></div>
      <div @click="checkCell(42)"></div>
      <div @click="checkCell(43)"></div>
      <div @click="checkCell(44)"></div>
      <div @click="checkCell(45)"></div>
      <div @click="checkCell(46)"></div>
      <div @click="checkCell(47)"></div>
      <div @click="checkCell(48)"></div>
      <div @click="checkCell(49)"></div>
      <div @click="checkCell(50)"></div>
      <div @click="checkCell(51)"></div>
      <div @click="checkCell(52)"></div>
      <div @click="checkCell(53)"></div>
      <div @click="checkCell(54)"></div>
      <div @click="checkCell(55)"></div>
      <div @click="checkCell(56)"></div>
      <div @click="checkCell(57)"></div>
      <div @click="checkCell(58)"></div>
      <div @click="checkCell(59)"></div>
      <div @click="checkCell(60)"></div>
      <div @click="checkCell(61)"></div>
      <div @click="checkCell(62)"></div>
      <div @click="checkCell(63)"></div>
      <div @click="checkCell(64)"></div>
      <div @click="checkCell(65)"></div>
      <div @click="checkCell(66)"></div>
      <div @click="checkCell(67)"></div>
      <div @click="checkCell(68)"></div>
      <div @click="checkCell(69)"></div>
      <div @click="checkCell(70)"></div>
      <div @click="checkCell(71)"></div>
      <div @click="checkCell(72)"></div>
      <div @click="checkCell(73)"></div>
      <div @click="checkCell(74)"></div>
      <div @click="checkCell(75)"></div>
      <div @click="checkCell(76)"></div>
      <div @click="checkCell(77)"></div>
      <div @click="checkCell(78)"></div>
      <div @click="checkCell(79)"></div>
      <div @click="checkCell(80)"></div>
      <div @click="checkCell(81)"></div>
      <div @click="checkCell(82)"></div>
      <div @click="checkCell(83)"></div>
      <div @click="checkCell(84)"></div>
      <div @click="checkCell(85)"></div>
      <div @click="checkCell(86)"></div>
      <div @click="checkCell(87)"></div>
      <div @click="checkCell(88)"></div>
      <div @click="checkCell(89)"></div>
      <div @click="checkCell(90)"></div>
      <div @click="checkCell(91)"></div>
      <div @click="checkCell(92)"></div>
      <div @click="checkCell(93)"></div>
      <div @click="checkCell(94)"></div>
      <div @click="checkCell(95)"></div>
      <div @click="checkCell(96)"></div>
      <div @click="checkCell(97)"></div>
      <div @click="checkCell(98)"></div>
      <div @click="checkCell(99)"></div>
    </div>
  </div>
</template>

<script>
document.body.style.backgroundColor = '#e9e9e9'

export default {
  data() {
    return {
      mineIndices: [],
      squares: []
    }
  },
  methods: {
    checkCell(cell_index) {
      if (!this.mineIndices.includes(cell_index)) {
        this.squares[cell_index].classList.add('uncovered')
      } else {
        let image_element = new Image(40,40)
        image_element.src = "/src/assets/mine.png"
        image_element.setAttribute("height", "40");
        image_element.setAttribute("width", "40");
        console.log(image_element)
        // this.squares[this.mineIndices[i]].appendChild(image_element)
        this.squares[cell_index].classList.add('mine')
        this.gameOver()
      }
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
    this.getSquares()
    this.placeMines(100, 10)
  }
}
</script>

<style scoped>

</style>