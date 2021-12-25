<template>

  <div id="levelbox">
    
    <!--Game Panel-->
    <GamePanel/>

    <div class="level1">

      <!--Game Grid-->
      <div v-for="cell in cells"
           :key="cell"
           @click="$store.dispatch('checkCell', {cell_index: cell, level: 1})"
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
      numberOfNeighborMines: 'numberOfNeighborMines',
      squares: 'squares',
      squaresBool: 'squaresBool'
    })
  },
  data() {
    return {
      num_cells: 100,
    }
  },
  methods: {
    ...mapActions([
      'checkCell',
      'gameOver',
      'getNeighborMinesRectangle',
      'getSquares',
      'instantiateRectangleDimensions',
      'makeCells',
      'placeFlag',
      'placeMines',
      'uncoverCell'
    ])
  },
  async mounted() {
    await store.dispatch('instantiateRectangleDimensions', {
      height: 10,
      width: 10
    })
    await store.dispatch('makeCells', {
      num_cells: this.num_cells
    })
    await store.dispatch('placeMines', {
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