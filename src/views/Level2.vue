<template>

  <div id="levelbox">
    
    <!--Game Panel-->
    <GamePanel/>

    <div class="level2">

      <!--Game Grid-->
      <div v-for="cell in cells"
           :key="cell"
           @click="$store.dispatch('checkCell', {cell_index: cell, level: 2})"
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
      height: 10,
      num_cells: 250,
      num_mines: 35,
      width: 25
    }
  },
  methods: {
    ...mapActions([
      'checkCell',
      'gameLoss',
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
      height: this.height,
      num_cells: this.num_cells,
      num_mines: this.num_mines,
      width: this.width
    })
    await store.dispatch('makeCells', {
      num_cells: this.num_cells
    })
    console.log(store.state)
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
