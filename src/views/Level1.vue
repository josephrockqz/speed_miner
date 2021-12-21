<template>
    <div>
      <!--Game Grid-->
      <div
        class="main-grid"
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
</template>

<script>
document.body.style.backgroundColor = '#e9e9e9'

export default {
  data() {
    return {
      squares: []
    }
  },
  methods: {
    getSquares() {
      this.squares = Array.from(document.querySelectorAll('.main-grid div'))
      console.log(this.squares)
    },
    placeMines(num_cells, num_mines) {
      // function to get random integer in range of
      // number of cells in the level
      function getRandomInt(max) {
        return Math.floor(Math.random() * max)
      }
      // code snippet gets the indices for the random
      // placement of the mines in the level
      let placements = []
      let i = 0
      while (i < num_mines) {
        let placement = getRandomInt(num_cells)
        if (!placements.includes(placement)) {
          placements.push(placement)
          i++
        }
      }
      console.log(placements)
      // code snippet changes appearance of mine cells
      // this will be changed
      for (let i = 0; i < num_mines; i++) {
        this.squares[placements[i]].classList.add('mine')
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