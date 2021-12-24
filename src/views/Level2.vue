<template>

  <div id="levelbox">
    
    <!--Game Panel-->
    <GamePanel/>

    <div class="level2">

      <!--Game Grid-->
      <div v-for="cell in cells"
           :key="cell"
           @click="$store.dispatch('checkCell', {cell_index: cell, height: 10, level: 2, width: 25})"
           @click.right.prevent="$store.dispatch('placeFlag', {cell_index: cell, level: 2})"></div>

    </div>

  </div>

</template>

<script>
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
      num_cells: 250,
    }
  },
  methods: {
    ...mapActions([
      'checkCell',
      'gameOver',
      'getNeighborMinesRectangle',
      'getSquares',
      'makeCells',
      'placeFlag',
      'placeMines',
      'resetNeighborMines'
    ])
  },
  mounted() {
    store.dispatch('makeCells', {
      num_cells: this.num_cells
    })
    store.dispatch('placeMines', {
      num_cells: this.num_cells,
      num_mines: 30
    })
  }
}
</script>

<style scoped>
.level2 {
  width: 1020px;
  height: 420px;
  flex-wrap: wrap;
  display: flex;
  background-color: #999999;
  border: #000000 10px solid;
  margin: 0 auto;
}
.level2 div {
  height: 40px;
  width: 40px;
  border: #ffffff 1px solid;
  margin: 0px;
  padding: 0px;
}
</style>
